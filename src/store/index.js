import { createStore } from 'vuex'
import { auth, usersCollection } from '@/includes/firebase'
import { Howl } from 'howler'

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
    sound: {},
  },

  mutations: {
    toggleCurrentSong(state, payload) {
      state.currentSong = payload;
    },

    toggleSound(state, payload) {
      state.sound = payload;
    },
  },

  actions: {
    async newSong({ commit }, payload) {
      commit('toggleCurrentSong', payload)

      this.sound = new Howl({
        src: [payload.fileUrl],
        html5: true,
      })

      commit('toggleSound', this.sound)

      this.sound.play()
    },

    async toggleAudio({ state }) {
      if (!state.sound.playing) {
        return
      }

      if (state.sound.playing()) {
        state.sound.pause()
      } else {
        state.sound.play()
      }
    },
  },

  getters: {
    isPlaying: (state) => {
      if (state.sound.playing) {
        return state.sound.playing()
      }

      return false
    },
  },
}

export default createStore({
  modules: {
    useUserStore,
    usePlayerStore,
  },
})
