import { defineStore } from "pinia"
import { Howl } from "howler"
import { useRoute } from "vue-router"

import { formatTime, limitVolume } from "@/includes/formatters"

export default defineStore("player", {
  state: () => ({
    currentSong: {},
    sound: {},
    seek: "00:00",
    duration: "00:00",
    playerProgress: "0%",
    volumeLevel: "30%",
    route: useRoute()
  }),

  actions: {
    async newSong(song) {
      if (this.sound instanceof Howl) {
        this.sound.unload()
      }

      this.currentSong = song

      this.sound = new Howl({
        src: [song.fileUrl],
        volume: 0.3,
        html5: true
      })

      this.sound.play()

      this.sound.on("play", () => {
        requestAnimationFrame(this.updateProgress)
      })
    },

    async toggleAudio() {
      if (!this.sound.playing) {
        return
      }

      if (this.sound.playing()) {
        this.sound.pause()
      } else {
        this.sound.play()
      }
    },

    updateProgress() {
      this.seek = formatTime(this.sound.seek())
      this.duration = formatTime(this.sound.duration())

      this.playerProgress = `${
        (this.sound.seek() / this.sound.duration()) * 100
      }%`

      if (this.sound.playing()) {
        requestAnimationFrame(this.updateProgress)
      }
    },

    updateSeek(event) {
      if (!this.sound.playing) {
        return
      }

      const { x, width } = event.currentTarget.getBoundingClientRect()
      const clickX = event.clientX - x
      const percentage = clickX / width
      const seconds = this.sound.duration() * percentage

      this.sound.seek(seconds)
      this.sound.once("seek", this.updateProgress)
    },

    updateVolume(event) {
      const { x, width } = event.currentTarget.getBoundingClientRect()
      const clickX = event.clientX - x
      const rawVolume = clickX / width

      const volume = limitVolume(rawVolume)

      this.sound.volume(volume)
      this.volumeLevel = `${volume * 100}%`
    },

    updateVerticalVolume(event) {
      const { y, height } = event.currentTarget.getBoundingClientRect()
      const clickY = event.clientY - y
      const rawVolume = 1 - clickY / height

      const volume = limitVolume(rawVolume)

      this.sound.volume(volume)
      this.volumeLevel = `${volume * 100}%`
    }
  },

  getters: {
    isPlaying: (state) => {
      if (state.sound.playing) {
        return state.sound.playing()
      }

      return false
    },

    isCurrentPlaying: (state) => {
      if (!state.currentSong.songID) {
        return
      }

      if (
        state.route.params.id === state.currentSong.songID &&
        state.sound.playing()
      ) {
        return state.sound.playing()
      } else {
        return false
      }
    }
  }
})
