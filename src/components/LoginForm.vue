<script>
import { mapActions } from "pinia"
import useUserStore from "@/stores/user"

import { VueRecaptcha } from "vue-recaptcha"

export default {
  name: "LoginForm",

  components: {
    VueRecaptcha
  },

  data() {
    return {
      loginSchema: {
        email: {
          required: true,
          email: true
        },
        password: {
          required: true,
          min: 3,
          max: 30
        }
      },
      loginInSubmission: false,
      loginShowAlert: false,
      loginAlertVariant: "bg-blue-500",
      loginAlertMsg: "Please wait! We are logging you in.",
      loginRCVerified: false,
      siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY
    }
  },

  methods: {
    ...mapActions(useUserStore, ["authenticate"]),

    onVerify() {
      this.loginRCVerified = true
    },

    async login(values) {
      if (!this.loginRCVerified) {
        return
      }

      this.loginShowAlert = true
      this.loginInSubmission = true
      this.loginAlertVariant = "bg-blue-500"
      this.loginAlertMsg = "Please wait! We are logging you in."

      try {
        await this.authenticate(values)
      } catch (error) {
        this.loginInSubmission = false
        this.loginAlertVariant = "bg-red-500"
        this.loginAlertMsg = "Invalid login details."

        console.error(error)

        return
      }

      this.loginAlertVariant = "bg-green-500"
      this.loginAlertMsg = "Success! You are now logged in."

      window.location.reload()
    }
  }
}
</script>

<template>
  <div
    v-if="loginShowAlert"
    class="text-white text-center font-bold p-4 mb-4"
    :class="loginAlertVariant"
  >
    {{ loginAlertMsg }}
  </div>

  <VeeForm :validation-schema="loginSchema" @submit="login">
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <VeeField
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>

    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <VeeField
        name="password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage class="text-red-600" name="password" />
    </div>

    <VueRecaptcha :sitekey="siteKey" @verify="onVerify" />

    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 mt-8 rounded transition hover:bg-purple-700 disabled:bg-gray-400 !disabled:cursor-pointer"
      :disabled="loginInSubmission || !loginRCVerified"
    >
      Submit
    </button>
  </VeeForm>
</template>
