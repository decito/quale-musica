<script>
import { mapWritableState } from "pinia";
import useUserStore from "@/stores/user";
import { auth } from "./includes/firebase";

import Header from "@/components/Header.vue";
import AuthModal from "@/components/Auth.vue";
import Player from "@/components/Player.vue";

export default {
  name: "App",
  components: {
    Header,
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
  <Header />

  <router-view />

  <Player />

  <AuthModal />
</template>
