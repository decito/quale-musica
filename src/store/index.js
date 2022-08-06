import { createStore } from 'vuex'
import { auth, usersCollection } from '@/includes/firebase'

const useUserStore = {
  namespaced: true,

  state: {
    authModalShow: false,
    userLoggedIn: false,
  },

  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow
    },

    toggleLoggedValue(state) {
      state.userLoggedIn = !state.userLoggedIn
    },
  },

  actions: {
    async register({ commit }, payload) {
      const userCredentials = await auth
        .createUserWithEmailAndPassword(payload.email, payload.password)

      await usersCollection
        .doc(userCredentials.user.uid)
        .set(
          {
            name: payload.name,
            email: payload.email,
            age: payload.age,
            country: payload.country,
          },
        )

      await userCredentials.user.updateProfile({
        displayName: payload.name,
      })

      commit('toggleLoggedValue')
    },

    async login({ commit }, payload) {
      await auth.signInWithEmailAndPassword(
        payload.email,
        payload.password,
      )

      commit('toggleLoggedValue')
    },

    fetchUser({ commit }) {
      const user = auth.currentUser

      if (user) {
        commit('toggleLoggedValue')
      }
    },

    async logout({ commit }) {
      await auth.signOut()

      commit('toggleLoggedValue')
    },
  },
}

const usePlayerStore = {
  namespaced: true,

  state: {
    currentSong: {},
  },

  mutations: {
    toggleCurrentSong(state, payload) {
      state.currentSong = payload;
    },
  },

  actions: {
    newSong({ commit }, payload) {
      console.log(payload)

      commit('toggleCurrentSong', payload)
    },
  },
}

export default createStore({
  modules: { useUserStore, usePlayerStore },
})
