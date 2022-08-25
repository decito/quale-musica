<script>
import { mapWritableState } from "pinia";
import useUserStore from "@/stores/user";
import { auth } from "./includes/firebase";

import AppHeader from "@/components/Header.vue";
import AuthModal from "@/components/Auth.vue";
import Player from "@/components/Player.vue";

export default {
  name: "App",
  components: {
    AppHeader,
    Player,
    AuthModal,
  },

  computed: {
    ...mapWritableState(useUserStore, ["userLoggedIn"]),
  },

  created() {
    if (auth.currentUser) {
      this.userLoggedIn = true;
    }
  },
};
</script>

<template>
  <AppHeader />

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
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
