<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      loginSchema: {
        email: {
          required: true,
          email: true,
        },
        password: {
          required: true,
          min: 3,
          max: 30,
        },
      },
      login_in_submission: false,
      login_show_alert: false,
      login_alert_variant: 'bg-blue-500',
      login_alert_msg: 'Please wait! We are logging you in.',
    }
  },
  methods: {
    login(values) {
      this.login_in_submission = true
      this.login_show_alert = true
      this.login_alert_variant = 'bg-blue-500'
      this.login_alert_msg = 'Please wait! We are logging you in.'

      this.login_alert_variant = 'bg-green-500'
      this.login_alert_msg = 'Success! You are now logged in.'
      console.log(values)
    },
  },
}
</script>

<template>
  <div
    v-if="login_show_alert"
    class="text-white text-center font-bold p-4 mb-4"
    :class="login_alert_variant"
  >
    {{ login_alert_msg }}
  </div>

  <VeeForm
    :validation-schema="loginSchema"
    @submit="login"
  >
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
      <label class="inline-block mb-2">Password</label>
      <VeeField
        type="password"
        name="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage class="text-red-600" name="password" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
        hover:bg-purple-700"
      :disable="login_in_submission"
    >
      Submit
    </button>
  </VeeForm>
</template>
