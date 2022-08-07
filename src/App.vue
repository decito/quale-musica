<script>
import AppHeader from './components/Header.vue'
import AuthModal from './components/Auth.vue'
import AppPlayer from './components/Player.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppPlayer,
    AuthModal,
  },
  created() {
    this.$store.dispatch('useUserStore/fetchUser')
  },
}
</script>

<template>
  <AppHeader />

  <router-view />

  <AppPlayer />

  <AuthModal />
</template>
