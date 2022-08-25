<script>
import { mapState, mapWritableState } from "pinia";
import useModalStore from "@/stores/modal";
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";

export default {
  name: "Auth",
  components: {
    LoginForm,
    RegisterForm,
  },
  data() {
    return {
      tab: "login",
    };
  },

  computed: {
    ...mapState(useModalStore, ["hiddenClass"]),

    ...mapWritableState(useModalStore, {
      modalVisibility: "isOpen",
    }),
  },
};
</script>

<template>
  <div
    id="modal"
    class="fixed z-30 inset-0 overflow-y-auto"
    :class="hiddenClass"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800 opacity-75" />
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">
        &#8203;
      </span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <!-- Add margin to allow visualization of some of the overlay behind the modal-->
        <div class="py-4 text-left px-6">
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">Your Account</p>

            <div
              class="modal-close cursor-pointer z-40"
              @click="modalVisibility = false"
            >
              <i class="fas fa-times" />
            </div>
          </div>

          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                href="#"
                :class="{
                  'hover:text-white text-white bg-blue-600': tab === 'login',
                  'hover:text-blue-600': tab === 'register',
                }"
                @click.prevent="tab = 'login'"
              >
                Login
              </a>
            </li>

            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                href="#"
                :class="{
                  'hover:text-white text-white bg-blue-600': tab === 'register',
                  'hover:text-blue-600': tab === 'login',
                }"
                @click.prevent="tab = 'register'"
              >
                Register
              </a>
            </li>
          </ul>

          <LoginForm v-if="tab === 'login'" />

          <RegisterForm v-else />
        </div>
      </div>
    </div>
  </div>
</template>
