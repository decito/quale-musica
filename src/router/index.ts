import { useUserStore } from '@/stores/user'
import About from '@/views/About.vue'
import Home from '@/views/Home.vue'
import Manage from '@/views/Manage.vue'
import SongView from '@/views/SongView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home
  },
  {
    name: 'about',
    path: '/about',
    component: About
  },
  {
    name: 'manage',
    // alias: "/manage",
    path: '/manage-music',
    meta: {
      requiresAuth: true
    },
    component: Manage
  },
  {
    path: '/manage',
    redirect: { name: 'manage' }
  },
  {
    name: 'song',
    path: '/song/:id',
    component: SongView
    // beforeEnter: async (to, _from, next) => {
    //   const snapshot = await songsCollection.doc(to.params.id).get()

    //   next((vm) => {
    //     if (!snapshot.exists) {
    //       vm.$router.push({ name: 'home' })
    //       return
    //     }

    //     const { sort } = vm.$route.query
    //     vm.sort = sort === '1' || sort === '2' ? sort : '1'

    //     vm.song = snapshot.data()
    //     vm.song.songID = vm.$route.params.id
    //     vm.getComments()
    //   })
    // }
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-sky-500'
})

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  const { userLoggedIn } = useUserStore()

  if (userLoggedIn) {
    next()
  } else {
    next({ name: 'home' })
  }
})

export default router
