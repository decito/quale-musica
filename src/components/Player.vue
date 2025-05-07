<script>
import { usePlayerStore } from '@/stores/player'
import { useMediaQuery } from '@vueuse/core'
import { mapActions, mapState } from 'pinia'

export default {
  name: 'Player',

  data() {
    return {
      isDesktop: useMediaQuery('(min-width: 1024px)'),
      showVolumeBar: false
    }
  },

  methods: {
    ...mapActions(usePlayerStore, [
      'toggleAudio',
      'updateSeek',
      'updateVolume',
      'updateVerticalVolume'
    ])
  },

  computed: {
    ...mapState(usePlayerStore, [
      'isPlaying',
      'seek',
      'duration',
      'playerProgress',
      'currentSong',
      'volumeLevel'
    ])
  }
}
</script>

<template>
  <div
    v-if="currentSong.modifiedName"
    class="fixed bottom-0 left-0 z-20 w-full bg-white px-4 py-2 dark:bg-stone-700 dark:text-white"
  >
    <div class="text-center">
      <span class="song-title font-bold">{{ currentSong.modifiedName }}</span>
      by

      <span class="song-artist">{{ currentSong.displayName }}</span>
    </div>

    <div class="flex flex-nowrap items-center gap-4">
      <button type="button" @click.prevent="toggleAudio">
        <i
          class="fas text-xl text-gray-500 dark:text-white"
          :class="{
            'fa-play': !isPlaying,
            'fa-pause': isPlaying
          }"
        />
      </button>

      <div class="player-currenttime">{{ seek }}</div>

      <div
        class="relative h-2 w-full cursor-pointer rounded-sm bg-gray-200 dark:bg-stone-400"
        @click.prevent="updateSeek"
      >
        <span
          class="absolute -top-2.5 -ml-2.5 text-lg text-gray-800 dark:text-white"
          :style="{ left: playerProgress }"
        >
          <i class="fas fa-circle" />
        </span>

        <span
          class="block h-2 rounded-sm bg-linear-to-r from-green-500 to-green-400"
          :style="{ width: playerProgress }"
        />
      </div>

      <div v-if="!isDesktop" class="relative flex cursor-pointer flex-col rounded-sm">
        <i
          class="fas fa-volume-high text-lg text-gray-500 dark:text-white"
          @click.prevent="showVolumeBar = !showVolumeBar"
          @touchstart="showVolumeBar = !showVolumeBar"
          @touchend="showVolumeBar = !showVolumeBar"
        />

        <div
          v-show="showVolumeBar"
          class="absolute -top-24 ml-2 h-20 w-2 -rotate-180"
          @click.prevent="updateVerticalVolume"
        >
          <span class="-top-24 block h-20 w-2 rounded-sm bg-gray-200" />

          <div
            class="-mt-20 block w-2 rounded-sm bg-linear-to-r from-green-500 to-green-400"
            :style="{ height: volumeLevel }"
          />

          <span class="absolute -ml-1" :style="{ top: `calc(${volumeLevel} - 15%)` }">
            <i class="fas fa-circle" />
          </span>
        </div>
      </div>

      <div
        v-else
        class="relative h-2 w-1/12 cursor-pointer rounded-sm bg-gray-200 dark:bg-stone-400"
        @click.prevent="updateVolume"
      >
        <span
          class="absolute -top-2.5 -ml-2.5 text-lg text-gray-800 dark:text-white"
          :style="{ left: volumeLevel }"
        >
          <i class="fas fa-circle" />
        </span>

        <span
          class="block h-2 rounded-sm bg-linear-to-r from-green-500 to-green-400"
          :style="{ width: volumeLevel }"
        />
      </div>

      <div class="player-duration">{{ duration }}</div>
    </div>
  </div>
</template>
