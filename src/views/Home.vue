<script>
import SongItem from '@/components/SongItem.vue'
import { auth, songsCollection } from '@/includes/firebase'

export default {
  name: 'Home',

  components: {
    SongItem
  },

  data() {
    return {
      songs: [],
      username: '',
      maxPerScroll: 25,
      isPendingRequest: false
    }
  },

  async created() {
    this.getSongs()

    if (auth.currentUser) {
      this.username = `, ${auth.currentUser.displayName}`
    }
    window.addEventListener('scroll', this.handleScroll)
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement
      const { innerHeight } = window
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight

      if (bottomOfWindow) {
        this.getSongs()
      }
    },

    async getSongs() {
      if (this.isPendingRequest) {
        return
      }

      this.isPendingRequest = true

      let snapshots

      if (this.songs.length) {
        const lastDoc = await songsCollection.doc(this.songs[this.songs.length - 1].docID).get()

        snapshots = await songsCollection
          .orderBy('modifiedName')
          .startAfter(lastDoc)
          .limit(this.maxPerScroll)
          .get()
      } else {
        snapshots = await songsCollection.orderBy('modifiedName').limit(this.maxPerScroll).get()
      }

      snapshots.forEach((document) => {
        this.songs.push({
          docID: document.id,
          ...document.data()
        })
      })

      this.isPendingRequest = false
    }
  }
}
</script>

<template>
  <main>
    <section class="container mx-auto">
      <div class="mt-12 dark:text-white">
        <span class="pl-2 text-2xl font-bold">Hi there{{ username }}!</span>
      </div>

      <ol id="playlist" class="grid grid-cols-3 gap-8 pt-20 md:grid-cols-5 lg:grid-cols-6">
        <SongItem v-for="song in songs" :key="song.docID" :song="song" />
      </ol>
    </section>
  </main>
</template>
