<script setup lang="ts">
import AuthModal from "@/components/Auth.vue";
//@ts-expect-error type
import AppHeader from "@/components/Header.vue";
import PlayerBar from "@/components/PlayerBar.vue";
import { useUserStore } from "@/stores/user";
import { onBeforeMount } from "vue";

const { checkUserLoggedIn } = useUserStore();

onBeforeMount(() => {
  checkUserLoggedIn();
});
</script>

<template>
  <AppHeader class="fixed z-10 w-full" />

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" class="pt-20" />
    </transition>
  </router-view>

  <PlayerBar />

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
