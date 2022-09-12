<script setup>
import { onBeforeMount } from "vue";
import useUserStore from "@/stores/user";
import { auth } from "./includes/firebase";

import AppHeader from "@/components/Header.vue";
import AuthModal from "@/components/Auth.vue";
import Player from "@/components/Player.vue";

const userStore = useUserStore();

onBeforeMount(() => {
  if (auth.currentUser) {
    userStore.userLoggedIn = true;
  }
});
</script>

<template>
  <AppHeader class="fixed z-10 w-full" />

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" class="pt-20"></component>
    </transition>
  </router-view>

  <Player />

  <AuthModal />
</template>

<style>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.2s linear;
}

.fade-leave-to {
  transition: all 0.2s linear;
  opacity: 0;
}
</style>
