import { defineStore } from "pinia";
import { Howl } from "howler";

export default defineStore("player", {
  state: () => ({
    currentSong: {},
    sound: {},
  }),

  actions: {
    async newSong(song) {
      this.currentSong = song;

      this.sound = new Howl({
        src: [song.fileUrl],
        html5: true,
      });

      this.sound.play();
    },

    async toggleAudio() {
      if (!this.sound.playing) {
        return;
      }

      if (this.sound.playing()) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
    },
  },

  getters: {
    isPlaying: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }

      return false;
    },
  },
});
