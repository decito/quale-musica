<script>
export default {
  name: 'RegisterForm',
  data() {
    return {
      schema: {
        name: {
          required: true,
          min: 3,
          max: 30,
          alpha_spaces: true,
        },
        email: {
          required: true,
          min: 3,
          max: 30,
          email: true,
        },
        age: {
          required: true,
          min_value: 13,
          max_value: 110,
        },
        password: {
          required: true,
          min: 3,
          max: 30,
        },
        confirm_password: {
          password_mismatch: '@password',
        },
        country: {
          required: true,
          country_excluded: 'Brazil',
        },
        tos: {
          tos: true,
        },
      },
      userData: {
        country: 'USA',
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: 'bg-blue-500',
      reg_alert_msg: 'Please wait! Your account is being created.',
    }
  },

  methods: {
    async register(values) {
      this.reg_show_alert = true
      this.reg_in_submission = true
      this.reg_alert_variant = 'bg-blue-500'
      this.reg_alert_msg = 'Please wait! Your account is being created.'

      try {
        await this.$store.dispatch('useUserStore/register', values)
      } catch (error) {
        this.reg_in_submission = false
        this.reg_alert_variant = 'bg-red-500'
        this.reg_alert_msg = 'An unexpected error occurred. Please try again.'

        return
      }

      this.reg_alert_variant = 'bg-green-500'
      this.reg_alert_msg = 'Success! Your account has been created.'

      window.location.reload()
    },
  },
}
</script>

<template>
  <div
    v-if="reg_show_alert"
    class="text-white text-center font-bold p-5 mb-4"
    :class="reg_alert_variant"
  >
    {{ reg_alert_msg }}
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
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <ErrorMessage class="text-red-600" name="name" />
    </div>

    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>

      <VeeField
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>

    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>

      <VeeField
        type="number"
        name="age"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage class="text-red-600" name="age" />
    </div>

    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>

      <VeeField name="password" :bails="false" v-slot="{ field, errors }">
        <input
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password" type="password" v-bind="field" />
        <div class="text-red-600" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </VeeField>
    </div>

    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>

      <VeeField
        type="password"
        name="confirm_password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
      />
      <ErrorMessage class="text-red-600" name="confirm_password" />
    </div>

    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>

      <VeeField
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
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
      />

      <label class="inline-block w-full">Accept terms of service</label>

      <ErrorMessage class="text-red-600" name="tos" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
        hover:bg-purple-700"
      :disable="reg_in_submission"
    >
      Submit
    </button>
  </VeeForm>
</template>
