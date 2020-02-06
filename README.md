# 「Vue.js + Go 言語 + Firebase 」での認証のサンプルアプリ

このレポジトリは[vue-golang-fireauth](https://github.com/po3rin/vue-golang-fireauth)を純粋に写経したものである。このREADMEは整理として自分でまとめた。デプロイはしていない。

## ローカル環境
go 1.13.6 / vue 3.5.0 / node v13.1.0

## 動かし方
```
# Firebaseコンソールで"Genarate new private key"ボタンを押下し、秘密鍵が書かれたjsonファイルをダウンロードし、プロジェクトdir内に置く。
$ export GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-file.json
$ go run server/src/main.go
$ npm run dev
# ブラウザでlocalhost:8080にアクセス
```

## システムの仕様

本サンプルアプリは３つのページからなる。
* SignUpページ
* SignInページ
* トップページ　(publicボタン、privateボタンを含む)

本アプリの会員認証はメールアドレス＋パスワードで行う。SignUpまたはSignInに成功するとトップページに飛ばされる。この状態での中央紹介文は「Welcome to Your Vue.js App」であり、このページにはlogout/public/privateの三つのボタンが存在する。ログアウトボタンを押すとログアウトされ、サインアップページに飛ばされる。publicボタンを押すとトップページの紹介文が「hello public」に、privateボタンを押すとトップページの紹介文が「hello private」に書き換わる。なお、なおトップページはログインしていないとアクセスできない。


## 設計
* 認証機能にはFirebase Authenticationを使っている。このため、Golangバックエンドでは秘密鍵を(環境変数として?)読み込ませることが必要である。
ユーザがSignUpを行った時は、そのリクエストはJSからFirebaseに送られ、Firebaseにおいてユーザ登録がされる。登録失敗した際は、生じたエラーメッセージをそのままブラウザのwarinngに表示する。
* ユーザがSignInを行った時は、そのリクエストはJSからFirebaseに送られ、もし認証に成功した場合にはユーザ情報を含むresponseからJWTを取り出しブラウザのlocalStorageにjwtというキー名で格納される。認証失敗した際は生じたエラーメッセージをそのままブラウザのwarinngに表示する。
* ユーザはLogOutを行った時にはそのリクエストはJSからFirebaseに送られる。ブラウザのlocalStorageのjwtキーは消去される。

* ログインしていないとトップページにアクセスできないようにするためにはsrc/router/index.jsにおいてルーティングに`meta: { requiresAuth: true }`を設定し、`router.beforeEach()`を設定し実現する。

* トップページのpublic/privateボタンはJSからGoBackendの`localhost:8000`にリクエストを送信して文字列を取得し、それらを使ってDOM操作でFrontendのhtmlを書き換える。（そもそもトップページにログインしていないとアクセスできないのでこれら２つのボタンの違いが分かりにくいが、）実情はpubicボタンはサインインしていなくてもリクエスト可能であるが、privateボタンはログインしていないとリクエストが弾かれる。これが今回のシステムの肝である。GolangバックエンドではprivateハンドラはauthMiddleWare()でラッピングされており、リクエスト処理前にAuthorizationヘッダに含まれるJWTトークンを用いてFirebaseにアクセスして`auth.VerifyIDToken()`している。これが通れば`hello private`を、落ちれば`401Error`をリスポンスする。

* VueからGoBackendへのリクエストの際にはCORSの許可が必要である。Vueというオリジンからの受け入れはGoBackendのmain()内で実装される。
* ログインした状態でアプリ内のページをリロードすると、その度にfirebaseへログイン中かの認証が行われる。この認証が済む前ににVueがページを書き出してしまうと、Vueはサインインしていないユーザと認識してページを書き出す。これを防ぐために、App.vueで`firebase.auth().onAuthStateChanged()`で`new Vue()`をラッピングする。


## これから膨らませるとしたら

* GoBackendで認証成功した際、*ログインしているユーザに応じた認可により*、Firebase CloudStorageから情報を引っ張ってくるとか


## その他メモ

* JWS = {base64エンコードしたheader}.{base64エンコードしたclaims}.{署名}`
* CORS = Cross-Origin Resource Sharing
あるページを読み込む際に、そのページとはoriginが違うURLにリソースをリクエストすること。リソースのURLの「スキーム」「ホスト」「ポート」の3つの組み合わせを「オリジン」という。
* XMLHttpRequest (XHR) とは、Ajax (非同期通信) に使われるJSの組み込みオブジェクト。XHR を使うとサーバから受信済みの web ページから、さらにサーバへ通信リクエストを送ることができるよう。
