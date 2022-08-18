import { defineStore } from "pinia";
import { Howl } from "howler";

import helper from "@/includes/helper";

export default defineStore("player", {
  state: () => ({
    currentSong: {},
    sound: {},
    seek: "00:00",
    duration: "00:00",
    playerProgress: "0%",
  }),

  actions: {
    async newSong(song) {
      if (this.sound instanceof Howl) {
        this.sound.unload();
      }

      this.currentSong = song;

      this.sound = new Howl({
        src: [song.fileUrl],
        html5: true,
      });

      this.sound.play();

      this.sound.on("play", () => {
        requestAnimationFrame(this.updateProgress);
      });
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

    async updateProgress() {
      this.seek = helper.formatTime(this.sound.seek());
      this.duration = helper.formatTime(this.sound.duration());

      this.playerProgress = `${
        (this.sound.seek() / this.sound.duration()) * 100
      }%`;

      if (this.sound.playing()) {
        requestAnimationFrame(this.updateProgress);
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
