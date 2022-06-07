import { createApp } from 'vue'

import App from './App.vue'
import store from './store'
import router from './router'

import VeeValidatePlugin from './includes/validation'
import { auth } from './includes/firebase'

import './assets/tailwind.css'
import './assets/main.css'

let app

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)

    app.use(router)
    app.use(store)
    app.use(VeeValidatePlugin)

    app.mount('#app')
  }
})
