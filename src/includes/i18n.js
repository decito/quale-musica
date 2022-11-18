import { createI18n } from "vue-i18n"

import en from "@/locales/en.json"
import pt from "@/locales/pt.json"

export default createI18n({
  locale: localStorage.getItem("locale") || "en",
  fallbackLocale: "en",
  messages: {
    en,
    pt
  }
})
