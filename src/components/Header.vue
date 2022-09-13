<script>
import { mapStores } from "pinia";
import useModalStore from "@/stores/modal";
import useUserStore from "@/stores/user";

import CountryFlag from "vue-country-flag-next";

export default {
  name: "AppHeader",

  components: {
    CountryFlag,
  },

  data() {
    return {
      showLocale: false,
      themeMode: "dark",
    };
  },

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

    changeLocale(event) {
      this.$i18n.locale = event.target.getAttribute("lang");

      localStorage.setItem("locale", this.$i18n.locale);
    },

    toggleShowLocale() {
      this.showLocale = !this.showLocale;
    },

    toggleTheme() {
      const page = document.getElementById("teste");

      if (this.themeMode === "dark") {
        page.classList.remove("dark");
        localStorage.setItem("theme", "light");
        this.themeMode = "light";
      } else {
        page.classList.add("dark");
        localStorage.setItem("theme", "dark");
        this.themeMode = "dark";
      }
    },
  },
};
</script>

<template>
  <header id="header" class="bg-stone-900 z-20">
    <nav class="container mx-auto flex justify-start items-center py-6 px-2">
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        exact-active-class="no-active"
      >
        Qualé
      </router-link>

      <div class="flex flex-grow items-center justify-between relative">
        <ul class="flex flex-row mt-1">
          <li>
            <router-link :to="{ name: 'about' }" class="px-2 text-white">
              {{ $t("header.about") }}
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

        <section class="flex gap-8">
          <i
            class="fas text-white cursor-pointer"
            :class="[themeMode === 'light' ? 'fa-sun' : 'fa-moon']"
            @click="toggleTheme"
          />

          <i
            class="fas fa-globe text-white cursor-pointer"
            @click="toggleShowLocale"
          />
        </section>

        <ul
          v-show="showLocale"
          class="before:block before:absolute before:-top-3.5 before:w-1/12 before:right-0.5 before:content-['^'] before:h-1 text-white right-0 top-10 absolute"
        >
          <li class="bg-stone-600 flex flex-col rounded border">
            <div class="flex items-center cursor-pointer hover:bg-stone-500">
              <CountryFlag country="br" class="!m-0" />

              <span
                class="px-2"
                lang="pt"
                href="#"
                @click.prevent="changeLocale"
              >
                Português
              </span>
            </div>

            <div class="flex items-center cursor-pointer hover:bg-stone-500">
              <CountryFlag country="us" class="!m-0" />

              <span
                class="px-2"
                lang="en"
                href="#"
                @click.prevent="changeLocale"
              >
                English
              </span>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
