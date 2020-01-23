// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'

Vue.config.productionTip = false

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyAsWNN5x1R22anoLt1tfHdm9HEMpoZzbeI',
  authDomain: 'sample-authentication-5cdce.firebaseapp.com',
  databaseURL: 'https://sample-authentication-5cdce.firebaseio.com',
  projectId: 'sample-authentication-5cdce',
  storageBucket: 'sample-authentication-5cdce.appspot.com',
  messagingSenderId: '230742703063',
  appId: '1:230742703063:web:64d30c7f9fd48cfe08e992',
  measurementId: 'G-MK5L8C9C3J'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// Auth オブジェクトが中間状態（初期化など）ではないことを確認する
firebase.auth().onAuthStateChanged(user => {
  // eslint-disable-next-line
  new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
  })
})
