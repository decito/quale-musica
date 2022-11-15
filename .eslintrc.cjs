/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier"
  ],
  overrides: [
    {
      files: ["cypress/e2e/**.{cy,spec}.{js,ts,jsx,tsx}"],
      extends: ["plugin:cypress/recommended"]
    },
    {
      files: ["**.spec.js"],
      globals: {
        beforeEach: "readonly",
        describe: "readonly",
        expect: "readonly",
        test: "readonly",
        it: "readonly",
        vi: "readonly"
      }
    }
  ],
  env: {
    node: true
  },
  rules: {
    "vue/multi-word-component-names": "off"
  }
}
