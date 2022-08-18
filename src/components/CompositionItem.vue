<script>
import { songsCollection, storage } from "@/includes/firebase";

export default {
  name: "CompositionItem",

  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
    },
  },

  data() {
    return {
      showForm: false,
      schema: {
        modifiedName: {
          required: true,
          min: 2,
          max: 50,
        },
        genre: {
          required: true,
          min: 3,
          max: 10,
          alphaSpaces: true,
        },
      },
      inSubmission: false,
      showAlert: false,
      alertVariant: "bg-blue-500",
      alertMessage: "Please wait. Updating song...",
    };
  },

  methods: {
    async editSong(values) {
      this.inSubmission = true;
      this.showAlert = true;
      this.alertVariant = "bg-blue-500";
      this.alertMessage = "Please wait. Updating song...";

      await songsCollection
        .doc(this.song.docID)
        .update(values)
        .then(() => {
          this.inSubmission = false;
          this.showAlert = true;
          this.alertVariant = "bg-green-500";
          this.alertMessage = "Song updated successfully!";
        })
        .catch(() => {
          this.inSubmission = false;
          this.alertVariant = "bg-red-500";
          this.alertMessage = "Something went wrong. Please try again.";
        });

      this.updateSong(this.index, values);

      this.updateUnsavedFlag(false);
    },

    async deleteSong() {
      const storageRef = storage.ref();
      const songRef = storageRef.child(`songs/${this.song.originalName}`);

      await songRef.delete();

      await songsCollection.doc(this.song.docID).delete();

      this.removeSong(this.index);
    },
  },
};
</script>

<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modifiedName }}</h4>

      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times" />
      </button>

      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt" />
      </button>
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
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>

          <VeeField
            name="modifiedName"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modifiedName" />
        </div>

        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <VeeField
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>

        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :class="{ 'opacity-50': inSubmission }"
          :disabled="inSubmission"
          @input="updateUnsavedFlag(false)"
        >
          Submit
        </button>

        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="inSubmission"
          @click.prevent="showForm = false"
        >
          Go Back
        </button>
      </VeeForm>
    </div>
  </div>
</template>
