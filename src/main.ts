import "@/assets/main.css";
import "nprogress/nprogress.css";
import { createPinia } from "pinia";
//@ts-expect-error type
import { registerSW } from "virtual:pwa-register";
import { createApp } from "vue";
import CountryFlag from "vue-country-flag-next";
import App from "./App.vue";
import Icon from "./directives/icon.ts";
import GlobalComponents from "./includes/_globals";
import { auth, onAuthStateChanged } from "./includes/firebase";
import i18n from "./includes/i18n";
import progressBar from "./includes/progress-bar";
import VeeValidatePlugin from "./includes/validation.ts";
import router from "./router";

registerSW({ immediate: true });

progressBar(router);

const app = createApp(App);

onAuthStateChanged(auth, () => {
  app.use(createPinia());
  app.use(router);
  app.use(VeeValidatePlugin);
  app.use(i18n);
  app.use(GlobalComponents);

  app.component("CountryFlag", CountryFlag);

  app.directive("icon", Icon);

  app.mount("#app");
});
