<script>
import UploadSong from "@/components/UploadSong.vue"
import CompositionItem from "@/components/CompositionItem.vue"
import { auth, songsCollection } from "@/includes/firebase"

export default {
  name: "Manage",
  components: {
    UploadSong,
    CompositionItem
  },

  data() {
    return {
      songs: [],
      unsavedFlag: false
    }
  },

  async created() {
    const snapshot = await songsCollection
      .where("uid", "==", auth.currentUser.uid)
      .get()

    snapshot.forEach(this.addSong)
  },

  methods: {
    updateSong(index, values) {
      this.songs[index].modifiedName = values.modifiedName
      this.songs[index].genre = values.genre
    },

    removeSong(index) {
      this.songs.splice(index, 1)
    },

    addSong(document) {
      const song = {
        ...document.data(),
        docID: document.id
      }

      this.songs.push(song)
    },

    updateUnsavedFlag(value) {
      this.unsavedFlag = value
    }
  },

  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next()
    } else {
      const answer = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      )
      next(answer)
    }
  }
}
</script>

<template>
  <section class="container mx-auto">
    <div class="md:grid md:grid-cols-3 md:gap-4 mt-12">
      <div class="col-span-1">
        <UploadSong ref="upload" :addSong="addSong" />
      </div>

      <div class="col-span-2">
        <div
          class="bg-white dark:bg-stone-700 rounded-sm border border-gray-200 dark:border-gray-500 relative flex flex-col dark:text-white"
        >
          <div
            class="px-6 pt-6 pb-5 font-bold border-b border-gray-200 dark:border-gray-500"
          >
            <span class="card-title">{{ $t("manage.cardTitle") }}</span>

            <i
              class="fas fa-compact-disc float-right text-green-400 text-2xl"
            />
          </div>

          <div class="p-6">
            <CompositionItem
              v-for="(song, index) in songs"
              :key="song.docID"
              :song="song"
              :updateSong="updateSong"
              :index="index"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
