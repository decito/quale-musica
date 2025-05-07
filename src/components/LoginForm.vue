<script>
import { useUserStore } from '@/stores/user'
import { mapActions } from 'pinia'

import { VueRecaptcha } from 'vue-recaptcha'

export default {
  name: 'LoginForm',

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
      loginAlertVariant: 'bg-blue-500',
      loginAlertMsg: 'Please wait! We are logging you in.',
      loginRCVerified: false,
      siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY
    }
  },

  methods: {
    ...mapActions(useUserStore, ['authenticate']),

    onVerify() {
      this.loginRCVerified = true
    },

    async login(values) {
      if (!this.loginRCVerified) {
        return
      }

      this.loginShowAlert = true
      this.loginInSubmission = true
      this.loginAlertVariant = 'bg-blue-500'
      this.loginAlertMsg = 'Please wait! We are logging you in.'

      try {
        await this.authenticate(values)
      } catch (error) {
        this.loginInSubmission = false
        this.loginAlertVariant = 'bg-red-500'
        this.loginAlertMsg = 'Invalid login details.'

        console.error(error)

        return
      }

      this.loginAlertVariant = 'bg-green-500'
      this.loginAlertMsg = 'Success! You are now logged in.'

      window.location.reload()
    }
  }
}
</script>

<template>
  <div
    v-if="loginShowAlert"
    class="mb-4 p-4 text-center font-bold text-white"
    :class="loginAlertVariant"
  >
    {{ loginAlertMsg }}
  </div>

  <VeeForm :validation-schema="loginSchema" @submit="login">
    <div class="mb-3">
      <label class="mb-2 inline-block">Email</label>
      <VeeField
        name="email"
        type="email"
        class="block w-full rounded-sm border border-gray-300 px-3 py-1.5 text-gray-800 transition duration-500 focus:border-black focus:outline-hidden"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>

    <div class="mb-3">
      <label class="mb-2 inline-block">Password</label>
      <VeeField
        name="password"
        type="password"
        class="block w-full rounded-sm border border-gray-300 px-3 py-1.5 text-gray-800 transition duration-500 focus:border-black focus:outline-hidden"
        placeholder="Password"
      />
      <ErrorMessage class="text-red-600" name="password" />
    </div>

    <VueRecaptcha :sitekey="siteKey" @verify="onVerify" />

    <button
      type="submit"
      class="!disabled:cursor-pointer mt-8 block w-full rounded-sm bg-purple-600 px-3 py-1.5 text-white transition hover:bg-purple-700 disabled:bg-gray-400"
      :disabled="loginInSubmission || !loginRCVerified"
    >
      Submit
    </button>
  </VeeForm>
</template>
