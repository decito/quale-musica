<script setup lang="ts">
import AuthModal from '@/components/Auth.vue'
import AppHeader from '@/components/Header.vue'
import Player from '@/components/Player.vue'
import { useUserStore } from '@/stores/user'
import { onBeforeMount } from 'vue'

const { checkUserLoggedIn } = useUserStore()

onBeforeMount(() => {
  checkUserLoggedIn()
})
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
