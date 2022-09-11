<script>
export default {
  name: "SongItem",

  props: {
    song: {
      type: Object,
      required: true,
    },
  },
};
</script>

<template>
  <li
    :id="`song-${song.docID}`"
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50 dark:hover:bg-gray-600"
  >
    <div>
      <router-link
        :to="{ name: 'song', params: { id: song.docID } }"
        class="font-bold block text-gray-700 dark:text-gray-100"
      >
        {{ song.modifiedName }}
      </router-link>

      <span class="text-gray-500 dark:text-gray-300 text-sm">
        {{ song.displayName }}
      </span>
    </div>

    <div class="text-gray-600 dark:text-gray-100 text-lg">
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
  </li>
</template>
