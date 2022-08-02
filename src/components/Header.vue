<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'Header',
  computed: {
    ...mapState(['userLoggedIn']),
  },
  methods: {
    ...mapMutations(['toggleAuthModal']),

    logout() {
      this.$store.dispatch('logout')

      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: 'home' })
      }
    },
  },
}
</script>

<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        exact-active-class="no-active"
      >
        Music
      </router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <router-link :to="{ name: 'about' }" class="px-2 text-white">
              About
            </router-link>
          </li>

          <li v-if="!userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">
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
      </div>
    </nav>
  </header>
</template>
