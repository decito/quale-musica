<script>
import { mapActions, mapState } from "pinia"
import usePlayerStore from "@/stores/player"
import { useMediaQuery } from "@vueuse/core"

export default {
  name: "Player",

  data() {
    return {
      isDesktop: useMediaQuery("(min-width: 1024px)"),
      showVolumeBar: false
    }
  },

  methods: {
    ...mapActions(usePlayerStore, [
      "toggleAudio",
      "updateSeek",
      "updateVolume",
      "updateVerticalVolume"
    ])
  },

  computed: {
    ...mapState(usePlayerStore, [
      "isPlaying",
      "seek",
      "duration",
      "playerProgress",
      "currentSong",
      "volumeLevel"
    ])
  }
}
</script>

<template>
  <div
    v-if="currentSong.modifiedName"
    class="fixed bottom-0 left-0 bg-white dark:bg-stone-700 dark:text-white px-4 py-2 w-full z-20"
  >
    <div class="text-center">
      <span class="song-title font-bold">{{ currentSong.modifiedName }}</span>
      by

      <span class="song-artist">{{ currentSong.displayName }}</span>
    </div>

    <div class="flex flex-nowrap gap-4 items-center">
      <button type="button" @click.prevent="toggleAudio">
        <i
          class="fas text-gray-500 dark:text-white text-xl"
          :class="{
            'fa-play': !isPlaying,
            'fa-pause': isPlaying
          }"
        />
      </button>

      <div class="player-currenttime">{{ seek }}</div>

      <div
        class="w-full h-2 rounded bg-gray-200 dark:bg-stone-400 relative cursor-pointer"
        @click.prevent="updateSeek"
      >
        <span
          class="absolute -top-2.5 -ml-2.5 text-gray-800 dark:text-white text-lg"
          :style="{ left: playerProgress }"
        >
          <i class="fas fa-circle" />
        </span>

        <span
          class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
          :style="{ width: playerProgress }"
        />
      </div>

      <div
        v-if="!isDesktop"
        class="flex flex-col relative cursor-pointer rounded"
      >
        <i
          class="fas text-gray-500 dark:text-white text-lg fa-volume-high"
          @click.prevent="showVolumeBar = !showVolumeBar"
          @touchstart="showVolumeBar = !showVolumeBar"
          @touchend="showVolumeBar = !showVolumeBar"
        />

        <div
          v-show="showVolumeBar"
          class="absolute w-2 h-20 -top-24 ml-2 -rotate-180"
          @click.prevent="updateVerticalVolume"
        >
          <span class="block w-2 h-20 bg-gray-200 -top-24 rounded" />

          <div
            class="block w-2 -mt-20 rounded bg-gradient-to-r from-green-500 to-green-400"
            :style="{ height: volumeLevel }"
          />

          <span
            class="absolute -ml-1"
            :style="{ top: `calc(${volumeLevel} - 15%)` }"
          >
            <i class="fas fa-circle" />
          </span>
        </div>
      </div>

      <div
        v-else
        class="w-1/12 h-2 rounded bg-gray-200 dark:bg-stone-400 relative cursor-pointer"
        @click.prevent="updateVolume"
      >
        <span
          class="absolute -top-2.5 -ml-2.5 text-gray-800 dark:text-white text-lg"
          :style="{ left: volumeLevel }"
        >
          <i class="fas fa-circle" />
        </span>

        <span
          class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
          :style="{ width: volumeLevel }"
        />
      </div>

      <div class="player-duration">{{ duration }}</div>
    </div>
  </div>
</template>
