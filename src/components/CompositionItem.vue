<script>
import { songsCollection, storage } from "@/includes/firebase"
import UploadCover from "./UploadCover.vue"

export default {
  name: "CompositionItem",

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
      alertVariant: "bg-blue-500",
      alertMessage: "Please wait. Updating song..."
    }
  },

  methods: {
    async editSong(values) {
      this.inSubmission = true
      this.showAlert = true
      this.alertVariant = "bg-blue-500"
      this.alertMessage = "Please wait. Updating song..."

      await songsCollection
        .doc(this.song.docID)
        .update(values)
        .then(() => {
          this.inSubmission = false
          this.showAlert = true
          this.alertVariant = "bg-green-500"
          this.alertMessage = "Song updated successfully!"
        })
        .catch(() => {
          this.inSubmission = false
          this.alertVariant = "bg-red-500"
          this.alertMessage = "Something went wrong. Please try again."
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
  <div class="border-b border-gray-200 dark:border-gray-500 p-3 mb-4">
    <div v-show="!showForm" class="flex justify-between">
      <h4 class="inline-block text-2xl font-bold">{{ song.modifiedName }}</h4>

      <div class="flex gap-2 items-end">
        <button
          class="w-8 h-8 flex justify-center items-center text-sm rounded-sm text-white bg-sky-600 hover:bg-sky-500 transition duration-500"
          @click.prevent="showForm = !showForm"
        >
          <i class="fas fa-pencil" />
        </button>

        <button
          class="w-8 h-8 flex justify-center items-center text-sm rounded-sm text-white bg-red-700 hover:bg-red-600 transition duration-500"
          @click.prevent="deleteSong"
        >
          <i class="fas fa-trash-can" />
        </button>
      </div>
    </div>

    <div v-show="showForm">
      <div
        v-if="showAlert"
        class="text-white text-center font-bold p-4 mb-4"
        :class="alertVariant"
      >
        {{ alertMessage }}
      </div>

      <VeeForm
        :validation-schema="schema"
        :initial-values="song"
        @submit="editSong"
      >
        <main class="flex justify-between gap-4">
          <section class="flex flex-col gap-3 min-w-[48%]">
            <div>
              <label class="inline-block mb-2">Title</label>
              <VeeField
                name="modifiedName"
                type="text"
                class="block w-full py-1.5 px-3 dark:bg-stone-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-500 transition duration-500 focus:outline-hidden focus:border-black rounded-sm"
                placeholder="Enter Title"
                @input="updateUnsavedFlag(true)"
              />
              <ErrorMessage class="text-red-600" name="modifiedName" />
            </div>

            <div>
              <label class="inline-block mb-2">Genre</label>
              <VeeField
                name="genre"
                type="text"
                class="block w-full py-1.5 px-3 dark:bg-stone-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-500 transition duration-500 focus:outline-hidden focus:border-black rounded-sm"
                placeholder="Enter Genre"
                @input="updateUnsavedFlag(true)"
              />
              <ErrorMessage class="text-red-600" name="genre" />
            </div>
          </section>

          <section class="flex flex-col gap-4 min-w-[48%]">
            <UploadCover :song="song" />
          </section>
        </main>

        <footer class="flex justify-end gap-8 mt-3">
          <button
            type="submit"
            class="py-1.5 px-3 rounded-sm text-white bg-green-600"
            :class="{ 'opacity-50': inSubmission }"
            :disabled="inSubmission"
            @input="updateUnsavedFlag(false)"
          >
            Submit
          </button>

          <button
            type="button"
            class="py-1.5 px-3 rounded-sm text-white bg-gray-600"
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
