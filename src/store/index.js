import { createStore } from 'vuex'
import { auth, usersCollection } from '@/includes/firebase'

export default createStore({
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

    fetchUser({ commit }) {
      const user = auth.currentUser

      if (user) {
        commit('toggleLoggedValue')
      }
    },
  },
})
