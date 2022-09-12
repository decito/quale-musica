<script>
import { limitText } from "@/includes/formatters";

export default {
  name: "SongItem",

  props: {
    song: {
      type: Object,
      required: true,
    },
  },

  methods: {
    formatText(value) {
      return limitText(value);
    },
  },
};
</script>

<template>
  <li
    :id="`song-${song.docID}`"
    class="rounded bg-gray-200 dark:bg-stone-700 cursor-pointer transition duration-300 hover:bg-gray-50 dark:hover:bg-stone-600"
  >
    <router-link
      :to="{ name: 'song', params: { id: song.docID } }"
      class="flex justify-between font-semibold text-gray-700 dark:text-gray-100 items-center p-3"
    >
      <div>
        <p>{{ formatText(song.modifiedName) }}</p>

        <span class="text-gray-500 dark:text-gray-300 text-sm">
          {{ song.displayName }}
        </span>
      </div>

      <div class="text-gray-600 dark:text-gray-100">
        <router-link
          v-slot="{ navigate }"
          custom
          :to="{ name: 'song', params: { id: song.docID }, hash: '#comments' }"
        >
          <span class="comments" @click="navigate">
            <i class="fas fa-comments text-gray-600 dark:text-gray-100" />
            {{ song.commentCount }}
          </span>
        </router-link>
      </div>
    </router-link>
  </li>
</template>
