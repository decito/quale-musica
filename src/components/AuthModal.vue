<script setup lang="ts">
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/stores/modal";
import { XIcon } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const tab = ref<"login" | "register">("login");
const modalStore = useModalStore();

const { isOpen } = storeToRefs(modalStore);
const { setIsOpen } = modalStore;
</script>

<template>
  <div id="modal" class="fixed inset-0 z-30 overflow-y-auto" :class="cn(!isOpen && 'hidden')">
    <div
      class="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800 opacity-75" />
      </div>
      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:h-screen sm:align-middle"> &#8203; </span>
      <div
        class="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
      >
        <!-- Add margin to allow visualization of some of the overlay behind the modal-->
        <div class="px-6 py-4 text-left">
          <div class="flex items-center justify-between pb-4">
            <p class="text-2xl font-bold">Your Account</p>
            <div
              class="modal-close flex size-4 cursor-pointer items-center justify-center"
              @click="setIsOpen"
            >
              <XIcon class="size-4" />
            </div>
          </div>
          <ul class="mb-4 flex flex-wrap">
            <li class="flex-auto text-center">
              <a
                class="block rounded-sm px-4 py-3 transition"
                href="#"
                :class="
                  cn(
                    tab === 'login' && 'bg-blue-600 text-white hover:text-white',
                    tab === 'register' && 'hover:text-blue-600'
                  )
                "
                @click.prevent="tab = 'login'"
              >
                Login
              </a>
            </li>
            <li class="flex-auto text-center">
              <a
                class="block rounded-sm px-4 py-3 transition"
                href="#"
                :class="
                  cn(
                    tab === 'login' && 'hover:text-blue-600',
                    tab === 'register' && 'bg-blue-600 text-white hover:text-white'
                  )
                "
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
