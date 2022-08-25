<script>
import { mapStores } from "pinia";
import useModalStore from "@/stores/modal";
import useUserStore from "@/stores/user";

export default {
  name: "AppHeader",

  computed: {
    ...mapStores(useModalStore, useUserStore),

    currentLocale() {
      return this.$i18n.locale === "pt" ? "English" : "Português";
    },
  },

  methods: {
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen;
    },

    logout() {
      this.userStore.logout();

      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: "home" });
      }
    },

    changeLocale() {
      this.$i18n.locale = this.$i18n.locale === "pt" ? "en" : "pt";
    },
  },
};
</script>

<template>
  <header id="header" class="bg-stone-900">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        exact-active-class="no-active"
      >
        Qualé
      </router-link>

      <div class="flex flex-grow items-center">
        <ul class="flex flex-row mt-1">
          <li>
            <router-link :to="{ name: 'about' }" class="px-2 text-white">
              About
            </router-link>
          </li>

          <li v-if="!userStore.userLoggedIn">
            <a
              class="px-2 text-white"
              href="#"
              @click.prevent="toggleAuthModal"
            >
              Login / Register
            </a>
          </li>

          <template v-else>
            <li>
              <router-link :to="{ name: 'manage' }" class="px-2 text-white">
                Manage
              </router-link>
            </li>

            <li>
              <a class="px-2 text-white" href="#" @click.prevent="logout">
                Logout
              </a>
            </li>
          </template>
        </ul>

        <ul class="ml-auto">
          <li>
            <a class="px-2 text-white" href="#" @click.prevent="changeLocale">
              {{ currentLocale }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
