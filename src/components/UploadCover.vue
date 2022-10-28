<script>
import {
  auth,
  coversCollection,
  storage,
  songsCollection,
} from "@/includes/firebase";

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
      cover: {},
      hasCover: this.song.coverId || false,
      continueUpload: true,
    };
  },

  methods: {
    beforeUpload(file) {
      if (file.type !== "image/png") {
        console.error("Image must be a .png file.");
        this.continueUpload = false;
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          if (img.naturalWidth !== 500 || img.naturalHeight !== 500) {
            console.error(
              "Image must have the following dimensions: 500x500px."
            );
            this.continueUpload = false;
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

      if (!this.continueUpload) {
        return;
      }

      if (!navigator.onLine) {
        this.cover.task = {};
        this.cover.currentProgress = 100;
        this.cover.name = file.name;
        this.cover.variant = "bg-red-400";
        this.cover.textClass = "text-white";
        this.message = "You are offline. Try dropping the cover again.";

        setTimeout(() => this.errorController(), 3000);

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
        () => this.errorController(),
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
            .catch(() => this.errorController());
        }
      );
    },

    errorController() {
      this.cover.variant = "bg-red-400";
      this.cover.textClass = "!text-white";
      this.message = "Something went wrong. Please try again";

      this.cover.uploadingState = false;
    },

    successController(cover) {
      this.cover.variant = "bg-green-400";
      this.cover.textClass = "text-white";
      this.message = "All set! Just a little longer...";

      setTimeout(3000);

      this.hasCover = true;
      this.cover = {
        alt: cover.name,
        src: cover.fileUrl,
      };
      this.cover.variant = "bg-transparent";
      this.cover.uploadingState = false;
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
    <label class="inline-block">
      Cover
      <small v-if="!hasCover" class="text-gray-400"> (optional)</small>
    </label>

    <div v-if="hasCover" class="flex justify-center">
      <img :src="cover.src" :alt="cover.alt" />
    </div>

    <div
      v-else
      class="w-full relative px-10 py-16 rounded text-center border border-dashed border-gray-400 transition-all duration-500"
      :class="[
        cover.textClass,
        cover.variant,
        {
          'bg-green-400 border-green-400 border-solid !text-white': isDragover,
          '': cover.name,
          'text-gray-400': !cover.name,
        },
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

      <small>must be a .png file, 500x500px</small>
    </div>
  </div>
</template>
