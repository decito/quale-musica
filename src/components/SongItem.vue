<script>
import { coversCollection } from '@/includes/firebase'
import { limitText } from '@/includes/formatters'

export default {
  name: 'SongItem',

  props: {
    song: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      coverSrc: ''
    }
  },

  methods: {
    formatText(value) {
      return limitText(value)
    }
  },

  async mounted() {
    if (!this.song.coverId) {
      this.coverSrc = '/assets/img/frame-dark.png'
      return
    }

    const snapshots = await coversCollection.doc(this.song.coverId).get()

    this.coverSrc = snapshots.data().fileUrl
  }
}
</script>

<template>
  <li
    :id="`song-${song.docID}`"
    class="cursor-pointer rounded-sm bg-gray-200 transition duration-300 hover:bg-gray-50 dark:bg-stone-700 dark:hover:bg-stone-600"
  >
    <router-link
      :to="{ name: 'song', params: { id: song.docID } }"
      class="flex flex-col items-center justify-between font-semibold text-gray-700 dark:text-gray-100"
    >
      <header>
        <div>
          <img class="" :src="coverSrc" alt="cover" />
        </div>
      </header>

      <section class="w-full p-3">
        <div>
          <p>{{ formatText(song.modifiedName) }}</p>
          <span class="text-sm text-gray-500 dark:text-gray-300">
            {{ song.displayName }}
          </span>
        </div>
        <div class="text-gray-600 dark:text-gray-100">
          <router-link
            v-slot="{ navigate }"
            custom
            :to="{
              name: 'song',
              params: { id: song.docID },
              hash: '#comments'
            }"
          >
            <span class="comments" @click="navigate">
              <i class="fas fa-comments text-gray-600 dark:text-gray-100" />
              {{ song.commentCount }}
            </span>
          </router-link>
        </div>
      </section>
    </router-link>
  </li>
</template>
