<script>
import { songsCollection, storage } from '@/includes/firebase'
import UploadCover from './UploadCover.vue'

export default {
  name: 'CompositionItem',

  components: {
    UploadCover
  },

  props: {
    song: {
      type: Object,
      required: true
    },
    updateSong: {
      type: Function,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    removeSong: {
      type: Function,
      required: true
    },
    updateUnsavedFlag: {
      type: Function
    }
  },

  data() {
    return {
      showForm: false,
      schema: {
        modifiedName: {
          required: true,
          min: 2,
          max: 50
        },
        genre: {
          required: true,
          min: 3,
          max: 10,
          alphaSpaces: true
        }
      },
      inSubmission: false,
      showAlert: false,
      alertVariant: 'bg-blue-500',
      alertMessage: 'Please wait. Updating song...'
    }
  },

  methods: {
    async editSong(values) {
      this.inSubmission = true
      this.showAlert = true
      this.alertVariant = 'bg-blue-500'
      this.alertMessage = 'Please wait. Updating song...'

      await songsCollection
        .doc(this.song.docID)
        .update(values)
        .then(() => {
          this.inSubmission = false
          this.showAlert = true
          this.alertVariant = 'bg-green-500'
          this.alertMessage = 'Song updated successfully!'
        })
        .catch(() => {
          this.inSubmission = false
          this.alertVariant = 'bg-red-500'
          this.alertMessage = 'Something went wrong. Please try again.'
        })

      this.updateSong(this.index, values)

      this.updateUnsavedFlag(false)
    },

    async deleteSong() {
      const storageRef = storage.ref()
      const songRef = storageRef.child(`songs/${this.song.originalName}`)

      await songRef.delete()

      await songsCollection.doc(this.song.docID).delete()

      this.removeSong(this.index)
    }
  }
}
</script>

<template>
  <div class="mb-4 border-b border-gray-200 p-3 dark:border-gray-500">
    <div v-show="!showForm" class="flex justify-between">
      <h4 class="inline-block text-2xl font-bold">{{ song.modifiedName }}</h4>

      <div class="flex items-end gap-2">
        <button
          class="flex h-8 w-8 items-center justify-center rounded-sm bg-sky-600 text-sm text-white transition duration-500 hover:bg-sky-500"
          @click.prevent="showForm = !showForm"
        >
          <i class="fas fa-pencil" />
        </button>

        <button
          class="flex h-8 w-8 items-center justify-center rounded-sm bg-red-700 text-sm text-white transition duration-500 hover:bg-red-600"
          @click.prevent="deleteSong"
        >
          <i class="fas fa-trash-can" />
        </button>
      </div>
    </div>

    <div v-show="showForm">
      <div v-if="showAlert" class="mb-4 p-4 text-center font-bold text-white" :class="alertVariant">
        {{ alertMessage }}
      </div>

      <VeeForm :validation-schema="schema" :initial-values="song" @submit="editSong">
        <main class="flex justify-between gap-4">
          <section class="flex min-w-[48%] flex-col gap-3">
            <div>
              <label class="mb-2 inline-block">Title</label>
              <VeeField
                name="modifiedName"
                type="text"
                class="block w-full rounded-sm border border-gray-300 px-3 py-1.5 text-gray-800 transition duration-500 focus:border-black focus:outline-hidden dark:border-gray-500 dark:bg-stone-700 dark:text-white"
                placeholder="Enter Title"
                @input="updateUnsavedFlag(true)"
              />
              <ErrorMessage class="text-red-600" name="modifiedName" />
            </div>

            <div>
              <label class="mb-2 inline-block">Genre</label>
              <VeeField
                name="genre"
                type="text"
                class="block w-full rounded-sm border border-gray-300 px-3 py-1.5 text-gray-800 transition duration-500 focus:border-black focus:outline-hidden dark:border-gray-500 dark:bg-stone-700 dark:text-white"
                placeholder="Enter Genre"
                @input="updateUnsavedFlag(true)"
              />
              <ErrorMessage class="text-red-600" name="genre" />
            </div>
          </section>

          <section class="flex min-w-[48%] flex-col gap-4">
            <UploadCover :song="song" />
          </section>
        </main>

        <footer class="mt-3 flex justify-end gap-8">
          <button
            type="submit"
            class="rounded-sm bg-green-600 px-3 py-1.5 text-white"
            :class="{ 'opacity-50': inSubmission }"
            :disabled="inSubmission"
            @input="updateUnsavedFlag(false)"
          >
            Submit
          </button>

          <button
            type="button"
            class="rounded-sm bg-gray-600 px-3 py-1.5 text-white"
            :disabled="inSubmission"
            @click.prevent="showForm = false"
          >
            Go Back
          </button>
        </footer>
      </VeeForm>
    </div>
  </div>
</template>
