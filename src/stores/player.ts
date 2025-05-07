import { formatTime, limitVolume } from '@/includes/formatters'
import { Howl } from 'howler'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentSong: {} as any,
    sound: {} as Howl,
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%',
    volumeLevel: '30%',
    route: useRoute()
  }),

  getters: {
    isPlaying: (state) => (state.sound.playing ? state.sound.playing() : false),

    isCurrentPlaying: (state) => {
      if (!state.currentSong.songID) return

      return state.route.params.id === state.currentSong.songID && state.sound.playing()
        ? state.sound.playing()
        : false
    }
  },

  actions: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async newSong(song: any) {
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

      this.sound.on('play', () => {
        requestAnimationFrame(this.updateProgress)
      })
    },

    async toggleAudio() {
      if (!this.sound.playing) return

      if (this.sound.playing()) this.sound.pause()
      else this.sound.play()
    },

    updateProgress() {
      this.seek = formatTime(this.sound.seek())
      this.duration = formatTime(this.sound.duration())

      this.playerProgress = `${(this.sound.seek() / this.sound.duration()) * 100}%`

      if (this.sound.playing()) {
        requestAnimationFrame(this.updateProgress)
      }
    },

    //@ts-expect-error type
    updateSeek(event) {
      if (!this.sound.playing) return

      const { x, width } = event.currentTarget.getBoundingClientRect()
      const clickX = event.clientX - x
      const percentage = clickX / width
      const seconds = this.sound.duration() * percentage

      this.sound.seek(seconds)
      this.sound.once('seek', this.updateProgress)
    },

    //@ts-expect-error type
    updateVolume(event) {
      const { x, width } = event.currentTarget.getBoundingClientRect()
      const clickX = event.clientX - x
      const rawVolume = clickX / width

      const volume = limitVolume(rawVolume)

      this.sound.volume(volume)
      this.volumeLevel = `${volume * 100}%`
    },

    //@ts-expect-error type
    updateVerticalVolume(event) {
      const { y, height } = event.currentTarget.getBoundingClientRect()
      const clickY = event.clientY - y
      const rawVolume = 1 - clickY / height

      const volume = limitVolume(rawVolume)

      this.sound.volume(volume)
      this.volumeLevel = `${volume * 100}%`
    }
  }
})
