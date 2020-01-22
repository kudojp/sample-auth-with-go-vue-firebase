# 「Vue.js + Go 言語 + Firebase 」での認証のサンプルアプリ

このレポジトリは[vue-golang-fireauth](https://github.com/po3rin/vue-golang-fireauth)を純粋に写経したものである。


## ローカル環境
go 1.13.6
vue 3.5.0
node v13.1.0

## 学んだこと

* JWS = {base64エンコードしたhead１er}.{base64エンコードしたclaims}.{署名}`

* CORS = Cross-Origin Resource Sharing = あるページを読み込む際に、そのページとはoriginが違うURLにリソースをリクエストした際でも、そのリスポンスの読み込みをブラウザ側でエラーにせずに表示すること。

とリソース自身のURLの「スキーム」「ホスト」「ポート」の3つの組み合わせを「オリジン」