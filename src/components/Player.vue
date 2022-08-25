<script>
import { mapActions, mapState } from "pinia";
import usePlayerStore from "@/stores/player";

export default {
  name: "Player",

  methods: {
    ...mapActions(usePlayerStore, ["toggleAudio", "updateSeek"]),
  },

  computed: {
    ...mapState(usePlayerStore, [
      "isPlaying",
      "seek",
      "duration",
      "playerProgress",
      "currentSong",
    ]),
  },
};
</script>

<template>
  <div
    v-if="currentSong.modifiedName"
    class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full"
  >
    <div class="text-center">
      <span class="song-title font-bold">{{ currentSong.modifiedName }}</span>
      by

      <span class="song-artist">{{ currentSong.displayName }}</span>
    </div>

    <div class="flex flex-nowrap gap-4 items-center">
      <button type="button" @click.prevent="toggleAudio">
        <i
          class="fas text-gray-500 text-xl"
          :class="{
            'fa-play': !isPlaying,
            'fa-pause': isPlaying,
          }"
        />
      </button>

      <div class="player-currenttime">{{ seek }}</div>

      <div
        class="w-full h-2 rounded bg-gray-200 relative cursor-pointer"
        @click.prevent="updateSeek"
      >
        <span
          class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg"
          :style="{ left: playerProgress }"
        >
          <i class="fas fa-circle" />
        </span>

        <span
          class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
          :style="{ width: playerProgress }"
        />
      </div>

      <div class="player-duration">{{ duration }}</div>
    </div>
  </div>
</template>
