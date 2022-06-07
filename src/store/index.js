import { createStore } from 'vuex'

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
})
