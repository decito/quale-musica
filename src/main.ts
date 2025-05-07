import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import { auth } from './includes/firebase'
import i18n from './includes/i18n'
import VeeValidatePlugin from './includes/validation.ts'

//@ts-expect-error type
import { registerSW } from 'virtual:pwa-register'

import GlobalComponents from './includes/_globals'
import progressBar from './includes/progress-bar'

import CountryFlag from 'vue-country-flag-next'
import Icon from './directives/icon.ts'

import '@/assets/main.css'
import 'nprogress/nprogress.css'

registerSW({ immediate: true })

progressBar(router)

const app = createApp(App)

auth.onAuthStateChanged(() => {
  app.use(createPinia())
  app.use(router)
  app.use(VeeValidatePlugin)
  app.use(i18n)
  app.use(GlobalComponents)

  app.component("'CountryFlag'", CountryFlag)

  app.directive('icon', Icon)

  app.mount('#app')
})
