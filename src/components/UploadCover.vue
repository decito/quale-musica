<script>
import {
  auth,
  coversCollection,
  storage,
  songsCollection,
} from "@/includes/firebase";

import { sleep } from "@/includes/sleep";

export default {
  name: "UploadSong",

  props: {
    song: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isDragover: false,
      message: "Drop the image here...",
      cover: {
        textClass: "text-gray-400",
      },
      hasCover: this.song.coverId || false,
      continueUpload: true,
      typeError: false,
    };
  },

  methods: {
    async beforeUpload(file) {
      if (file.type !== "image/jpeg") {
        this.continueUpload = false;
        console.error("Image must be a .jpg or .jpeg file.");
        this.typeError = true;

        await sleep(3000);

        this.typeError = !this.typeError;
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = async () => {
          if (img.naturalWidth !== 500 || img.naturalHeight !== 500) {
            this.continueUpload = false;
            console.error(
              "Image must have the following dimensions: 500x500px."
            );
            this.typeError = true;

            await sleep(3000);

            this.typeError = !this.typeError;
          }
        };
      };
    },

    async uploadCover($event) {
      this.isDragover = false;

      const handleMultiple = $event.dataTransfer
        ? [...$event.dataTransfer.files]
        : [...$event.target.files];

      const file = handleMultiple[0];

      await this.beforeUpload(file);

      if (!this.continueUpload || this.cover.uploadingState) {
        return;
      }

      if (!navigator.onLine) {
        this.cover.task = {};
        this.cover.currentProgress = 100;

        this.errorController(true);

        return;
      }

      this.cover.uploadingState = true;

      const storageRef = storage.ref();
      const coverRef = storageRef.child(
        `covers/${this.song.originalName}-cover.png`
      );

      const task = coverRef.put(file);

      task.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.cover.currentProgress = progress;
        },
        () => this.errorController(false),
        async () => {
          const cover = {
            uid: auth.currentUser.uid,
            name: `${this.song.originalName}-cover`,
          };
          cover.fileUrl = await task.snapshot.ref.getDownloadURL();

          const coverCollectionRef = await coversCollection.add(cover);

          await songsCollection
            .doc(this.song.docID)
            .update({ coverId: coverCollectionRef.id })
            .then(() => this.successController(cover))
            .catch(() => this.errorController(false));
        }
      );
    },

    async errorController(offline) {
      this.cover.variant = "bg-red-400";
      this.cover.textClass = "text-white";

      offline
        ? (this.message = "You are offline. Please check your connection.")
        : (this.message = "Something went wrong. Please try again");

      await sleep(3000);

      this.cover.variant = "bg-transparent";
      this.cover.textClass = "text-gray-400";
      this.cover.uploadingState = false;
    },

    async successController(cover) {
      this.cover.variant = "bg-green-400";
      this.cover.textClass = "text-white";
      this.message = "All set! Just a little longer...";

      await sleep(3000);

      this.hasCover = true;
      this.cover = {
        alt: cover.name,
        src: cover.fileUrl,
      };
      this.cover.variant = "bg-transparent";
      this.cover.textClass = "text-gray-400";
      this.cover.uploadingState = false;
    },

    deleteCover() {
      console.error("Function not implemented yet.");
    },
  },

  async mounted() {
    if (this.song.coverId) {
      const snapshot = await coversCollection.doc(this.song.coverId).get();

      const cover = snapshot.data();

      this.cover = {
        alt: cover.name,
        src: cover.fileUrl,
      };
    }
  },
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <header class="flex justify-between">
      <label class="inline-block">
        Cover
        <small v-if="!hasCover" class="text-gray-400"> (optional)</small>
      </label>

      <button
        v-if="hasCover"
        class="text-red-400 border border-red-400 rounded py-0.5 px-1.5 hidden"
        @click.prevent="deleteCover"
      >
        Delete cover
      </button>
    </header>

    <div v-if="hasCover" class="flex justify-center">
      <img :src="cover.src" :alt="cover.alt" class="max-h-72" />
    </div>

    <div
      v-else
      class="w-full relative px-5 py-7 md:px-10 md:py-16 rounded text-center border border-dashed border-gray-400 transition-all duration-500"
      :class="[
        cover.textClass,
        cover.variant,
        isDragover && 'bg-green-400 border-green-400 border-solid !text-white',
      ]"
      @drag.prevent.stop=""
      @dragstart.prevent.stop=""
      @dragend.prevent.stop="isDragover = false"
      @dragover.prevent.stop="isDragover = true"
      @dragenter.prevent.stop="isDragover = true"
      @dragleave.prevent.stop="isDragover = false"
      @drop.prevent.stop="uploadCover($event)"
    >
      <h5>{{ message }}</h5>

      <div
        v-if="cover.uploadingState && cover.currentProgress !== 100"
        class="absolute h-full top-0 left-0 overflow-hidden rounded transition-all progress-bar"
        :class="cover.variant"
        :style="{ width: `${cover.currentProgress}%` }"
      />

      <small :class="typeError && 'text-red-400'">
        must be a .jpg or .jpeg file, 500x500px
      </small>
    </div>
  </div>
</template>
