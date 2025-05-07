import { auth, usersCollection } from '@/includes/firebase'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userLoggedIn = ref(false)

  const register = async (values) => {
    const userCredentials = await auth.createUserWithEmailAndPassword(values.email, values.password)

    await usersCollection.doc(userCredentials.user.uid).set({
      name: values.name,
      email: values.email,
      age: values.age,
      country: values.country
    })

    await userCredentials.user.updateProfile({
      displayName: values.name
    })

    userLoggedIn.value = true
  }

  const authenticate = async (values) => {
    await auth.signInWithEmailAndPassword(values.email, values.password)
    userLoggedIn.value = true
  }

  const logout = async () => {
    await auth.signOut()
    userLoggedIn.value = false
  }

  return { userLoggedIn, register, authenticate, logout }
})
