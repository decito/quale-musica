<script>
import { auth, storage, songsCollection } from '@/includes/firebase'

export default {
  name: 'Upload',
  props: {
    addSong: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      isDragover: false,
      uploads: [],
    };
  },
  methods: {
    uploadFiles($event) {
      this.isDragover = false

      const files = $event.dataTransfer
        ? [...$event.dataTransfer.files]
        : [...$event.target.files]

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          return
        }

        const storageRef = storage.ref()
        const songRef = storageRef.child(`songs/${file.name}`)
        const task = songRef.put(file)

        const uploadIndex = this.uploads.push({
          task,
          currentProgress: 0,
          name: file.name,
          variant: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          textClass: '',
          uploadingState: true,
        }) - 1

        task.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          this.uploads[uploadIndex].currentProgress = progress
        }, () => {
          this.uploads[uploadIndex].variant = 'bg-red-400'
          this.uploads[uploadIndex].icon = 'fas fa-xmark'
          this.uploads[uploadIndex].textClass = 'text-red-400'
          this.uploads[uploadIndex].uploadingState = false

          // console.error(error)
        }, async () => {
          const song = {
            uid: auth.currentUser.uid,
            displayName: auth.currentUser.displayName,
            originalName: task.snapshot.ref.name,
            modifiedName: task.snapshot.ref.name,
            genre: '',
            commentCount: 0,
          }

          song.fileUrl = await task.snapshot.ref.getDownloadURL()
          const songCollectionRef = await songsCollection.add(song)
          const songSnapshot = await songCollectionRef.get()

          this.addSong(songSnapshot)

          this.uploads[uploadIndex].variant = 'bg-green-400'
          this.uploads[uploadIndex].icon = 'fas fa-check'
          this.uploads[uploadIndex].textClass = 'text-green-400'
          this.uploads[uploadIndex].uploadingState = false
        })
      })
    },
    cancelUploads() {
      this.uploads.forEach((upload) => upload.task.cancel())
    },
  },
  beforeUnmount() {
    this.uploads.forEach((upload) => upload.task.cancel())
  },
}

// TODO: Merge upload div with input field

/*
  <input
    type="file"
    multiple
    @change="uploadFiles($event)"
    @drag.prevent.stop=""
    @dragstart.prevent.stop=""
    @dragend.prevent.stop="isDragover = false"
    @dragover.prevent.stop="isDragover = true"
    @dragenter.prevent.stop="isDragover = true"
    @dragleave.prevent.stop="isDragover = false"
    @drop.prevent.stop="uploadFiles($event)"
  >
*/
</script>

<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>

      <i class="fas fa-upload float-right text-green-400 text-2xl" />
    </div>

    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
          border-gray-400 text-gray-400 transition duration-500 hover:text-white
          hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': isDragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="isDragover = false"
        @dragover.prevent.stop="isDragover = true"
        @dragenter.prevent.stop="isDragover = true"
        @dragleave.prevent.stop="isDragover = false"
        @drop.prevent.stop="uploadFiles($event)"
      >
        <h5>Drop your files here</h5>
      </div>

      <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label-->
      <input type="file" multiple @change="uploadFiles($event)">

      <hr class="my-6" />

      <div v-for="upload in uploads" :key="upload.name" class="mb-4">
        <div class="font-bold text-sm" :class="upload.textClass">
          <i :class="upload.icon" /> {{ upload.name }}
        </div>

        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <div
            class="transition-all"
            :class="[upload.variant, upload.uploadingState && 'progress-bar']"
            :style="{ width: `${upload.currentProgress}%`}"
          />
        </div>
      </div>
    </div>
  </div>
</template>
