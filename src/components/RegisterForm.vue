<script>
import { mapActions } from "pinia"
import useUserStore from "@/stores/user"

import { VueRecaptcha } from "vue-recaptcha"

export default {
  name: "RegisterForm",

  components: {
    VueRecaptcha
  },

  data() {
    return {
      tab: "login",
      schema: {
        name: {
          required: true,
          min: 3,
          max: 30,
          alphaSpaces: true
        },
        email: {
          required: true,
          min: 3,
          max: 30,
          email: true
        },
        age: {
          required: true,
          minValue: 13,
          maxValue: 110
        },
        password: {
          required: true,
          min: 3,
          max: 30
        },
        confirmPassword: {
          passwordsMismatch: "@password"
        },
        country: {
          required: true,
          countryExcluded: "Brazil"
        },
        tos: {
          tos: true
        }
      },
      userData: {
        country: "USA"
      },
      regInSubmission: false,
      regShowAlert: false,
      regAlertVariant: "bg-blue-500",
      regAlertMsg: "Please wait! Your account is being created.",
      regRCVerified: false,
      siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY
    }
  },
  methods: {
    ...mapActions(useUserStore, { createUser: "register" }),

    onCheck(response) {
      if (response.target.checked) {
        this.$refs.recaptcha.execute()
      }
    },

    onVerify() {
      this.regRCVerified = true
    },

    async register(values) {
      if (!this.regRCVerified) {
        return
      }

      this.regShowAlert = true
      this.regInSubmission = true
      this.regAlertVariant = "bg-blue-500"
      this.regAlertMsg = "Please wait! Your account is being created."

      try {
        await this.createUser(values)
      } catch (error) {
        this.regInSubmission = false
        this.regAlertVariant = "bg-red-500"
        this.regAlertMsg =
          "An unexpected error occurred. Please try again later."

        console.error(error)

        return
      }

      this.regAlertVariant = "bg-green-500"
      this.regAlertMsg = "Success! Your account has been created."

      window.location.reload()
    }
  }
}
</script>

<template>
  <div
    v-if="regShowAlert"
    class="text-white text-center font-bold p-4 rounded mb-4"
    :class="regAlertVariant"
  >
    {{ regAlertMsg }}
  </div>

  <VeeForm
    :validation-schema="schema"
    :initial-values="userData"
    @submit="register"
  >
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>

      <VeeField
        type="text"
        name="name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <ErrorMessage class="text-red-600" name="name" />
    </div>

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
      <label class="inline-block mb-2">Age</label>

      <VeeField
        name="age"
        type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage class="text-red-600" name="age" />
    </div>

    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>

      <VeeField name="password" :bails="false" v-slot="{ field, errors }">
        <input
          v-bind="field"
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
        />

        <div class="text-red-600" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </VeeField>
    </div>

    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>

      <VeeField
        name="confirmPassword"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
      />
      <ErrorMessage class="text-red-600" name="confirmPassword" />
    </div>

    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>

      <VeeField
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="Brazil">Brazil</option>
      </VeeField>

      <ErrorMessage class="text-red-600" name="country" />
    </div>

    <div class="mb-3 pl-6">
      <VeeField
        name="tos"
        type="checkbox"
        value="1"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
        @click="onCheck"
      />

      <i18n-t
        class="inline-block w-full"
        keypath="register.accept"
        tag="label"
        scope="global"
      >
        <a href="#" class="underline">{{ $t("register.tos") }}</a>
      </i18n-t>

      <ErrorMessage class="text-red-600 block" name="tos" />

      <VueRecaptcha
        size="invisible"
        ref="recaptcha"
        @verify="onVerify"
        :sitekey="siteKey"
      />
    </div>

    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700 disabled:bg-gray-400 !disabled:cursor-pointer"
      :disabled="regInSubmission || !regRCVerified"
    >
      Submit
    </button>
  </VeeForm>
</template>
