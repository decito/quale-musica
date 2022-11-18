import { defineStore } from "pinia"
import { auth, usersCollection } from "@/includes/firebase"

export default defineStore("user", {
  state: () => ({
    userLoggedIn: false
  }),

  actions: {
    async register(values) {
      const userCredentials = await auth.createUserWithEmailAndPassword(
        values.email,
        values.password
      )

      await usersCollection.doc(userCredentials.user.uid).set({
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country
      })

      await userCredentials.user.updateProfile({
        displayName: values.name
      })

      this.userLoggedIn = true
    },

    async authenticate(values) {
      await auth.signInWithEmailAndPassword(values.email, values.password)

      this.userLoggedIn = true
    },

    async logout() {
      await auth.signOut()

      this.userLoggedIn = false
    }
  }
})
