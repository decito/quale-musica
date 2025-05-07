<script>
import { useModalStore } from '@/stores/modal'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'

import CountryFlag from 'vue-country-flag-next'

export default {
  name: 'AppHeader',

  components: {
    CountryFlag
  },

  data() {
    return {
      showLocale: false,
      themeMode: 'dark'
    }
  },

  computed: {
    ...mapStores(useModalStore, useUserStore),

    currentLocale() {
      return this.$i18n.locale === 'pt' ? 'English' : 'Português'
    }
  },

  methods: {
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen
    },

    logout() {
      this.userStore.logout()

      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: 'home' })
      }
    },

    changeLocale(event) {
      this.$i18n.locale = event.target.getAttribute('lang')

      localStorage.setItem('locale', this.$i18n.locale)
    },

    toggleShowLocale() {
      this.showLocale = !this.showLocale
    },

    toggleTheme() {
      const page = document.getElementById('html')

      if (this.themeMode === 'dark') {
        page.classList.remove('dark')
        localStorage.setItem('theme', 'light')
        this.themeMode = 'light'
      } else {
        page.classList.add('dark')
        localStorage.setItem('theme', 'dark')
        this.themeMode = 'dark'
      }
    }
  }
}
</script>

<template>
  <header id="header" class="z-20 bg-stone-900">
    <nav class="container mx-auto flex items-center justify-start px-2 py-6">
      <router-link
        class="mr-4 text-2xl font-bold text-white uppercase"
        :to="{ name: 'home' }"
        exact-active-class="no-active"
      >
        Qualé
      </router-link>

      <div class="relative flex grow items-center justify-between">
        <ul class="mt-1 flex flex-row">
          <li>
            <router-link :to="{ name: 'about' }" class="px-2 text-white">
              {{ $t('header.about') }}
            </router-link>
          </li>

          <li v-if="!userStore.userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">
              Login / Register
            </a>
          </li>

          <template v-else>
            <li>
              <router-link :to="{ name: 'manage' }" class="px-2 text-white"> Manage </router-link>
            </li>

            <li>
              <a class="px-2 text-white" href="#" @click.prevent="logout"> Logout </a>
            </li>
          </template>
        </ul>

        <section class="mt-1 flex gap-8">
          <i
            class="fas cursor-pointer text-white"
            :class="[themeMode === 'light' ? 'fa-sun' : 'fa-moon']"
            @click="toggleTheme"
          />

          <i class="fas fa-globe cursor-pointer text-white" @click="toggleShowLocale" />
        </section>

        <ul
          v-show="showLocale"
          class="absolute top-10 right-0 text-white before:absolute before:-top-3.5 before:right-0.5 before:block before:h-1 before:w-1/12 before:content-['^']"
        >
          <li class="flex flex-col rounded-sm border bg-stone-600">
            <div class="flex cursor-pointer items-center hover:bg-stone-500">
              <CountryFlag country="br" class="m-0!" />

              <span class="px-2" lang="pt" href="#" @click.prevent="changeLocale"> Português </span>
            </div>

            <div class="flex cursor-pointer items-center hover:bg-stone-500">
              <CountryFlag country="us" class="m-0!" />

              <span class="px-2" lang="en" href="#" @click.prevent="changeLocale"> English </span>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
