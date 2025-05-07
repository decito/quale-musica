<script>
import { auth, storage, songsCollection } from '@/includes/firebase'

export default {
  name: 'UploadSong',

  props: {
    addSong: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      isDragover: false,
      uploads: []
    }
  },

  methods: {
    uploadSongs($event) {
      this.isDragover = false

      const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files]

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          return
        }

        if (!navigator.onLine) {
          this.uploads.push({
            task: {},
            currentProgress: 100,
            name: file.name,
            variant: 'bg-red-400',
            icon: 'fas fa-xmark',
            textClass: 'text-red-400'
          })
          return
        }

        const storageRef = storage.ref()
        const songRef = storageRef.child(`songs/${file.name}`)

        const task = songRef.put(file)

        const uploadIndex =
          this.uploads.push({
            task,
            currentProgress: 0,
            name: file.name,
            variant: 'bg-blue-400',
            icon: 'fas fa-spinner fa-spin',
            textClass: '',
            uploadingState: true
          }) - 1

        task.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            this.uploads[uploadIndex].currentProgress = progress
          },
          () => {
            this.uploads[uploadIndex].variant = 'bg-red-400'
            this.uploads[uploadIndex].icon = 'fas fa-xmark'
            this.uploads[uploadIndex].textClass = 'text-red-400'
            this.uploads[uploadIndex].uploadingState = false
          },
          async () => {
            const song = {
              uid: auth.currentUser.uid,
              displayName: auth.currentUser.displayName,
              originalName: task.snapshot.ref.name,
              modifiedName: task.snapshot.ref.name,
              genre: '',
              commentCount: 0,
              coverID: ''
            }
            song.fileUrl = await task.snapshot.ref.getDownloadURL()

            const songCollectionRef = await songsCollection.add(song)

            const songSnapshot = await songCollectionRef.get()
            this.addSong(songSnapshot)

            this.uploads[uploadIndex].variant = 'bg-green-400'
            this.uploads[uploadIndex].icon = 'fas fa-check'
            this.uploads[uploadIndex].textClass = 'text-green-400'
            this.uploads[uploadIndex].uploadingState = false
          }
        )
      })
    },

    cancelUploads() {
      this.uploads.forEach((upload) => upload.task.cancel())
    }
  },

  beforeUnmount() {
    this.uploads.forEach((upload) => upload.task.cancel())
  }
}
</script>

<template>
  <div
    class="relative mb-10 flex flex-col rounded-sm border border-gray-200 bg-white dark:border-gray-500 dark:bg-stone-700 dark:text-white"
  >
    <div class="border-b border-gray-200 px-6 pt-6 pb-5 font-bold dark:border-gray-500">
      <span class="card-title">Upload</span>

      <i class="fas fa-upload float-right text-2xl text-green-400" />
    </div>

    <div class="p-6">
      <div
        class="w-full rounded-sm border border-dashed border-gray-400 px-10 py-20 text-center text-gray-400 transition duration-500"
        :class="{
          'border-solid border-green-400 bg-green-400 text-white!': isDragover
        }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="isDragover = false"
        @dragover.prevent.stop="isDragover = true"
        @dragenter.prevent.stop="isDragover = true"
        @dragleave.prevent.stop="isDragover = false"
        @drop.prevent.stop="uploadSongs($event)"
      >
        <h5>Drop your files here...</h5>
      </div>

      <label
        for="multipleFiles"
        class="mt-5 block w-full cursor-pointer rounded-sm border border-gray-200 bg-gray-200 px-2.5 py-5 text-center text-gray-800 transition duration-500 hover:border-green-400 hover:bg-green-400 hover:text-white dark:border-gray-500 dark:bg-stone-700 dark:text-white dark:hover:border-green-400 dark:hover:bg-green-400 dark:hover:text-white"
      >
        ... or click here to select files
      </label>

      <input
        id="multipleFiles"
        class="hidden"
        type="file"
        accept="audio/mpeg"
        multiple
        @change="uploadSongs($event)"
      />

      <hr class="my-6 dark:border-gray-500" />

      <div v-for="upload in uploads" :key="upload.name" class="mb-4">
        <div class="text-sm font-bold" :class="upload.textClass">
          <i :class="upload.icon" /> {{ upload.name }}
        </div>

        <div class="flex h-4 overflow-hidden rounded-sm bg-gray-200">
          <div
            class="transition-all"
            :class="[upload.variant, upload.uploadingState && 'progress-bar']"
            :style="{ width: `${upload.currentProgress}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
