<script>
export default {
  name: 'SongItem',
  props: {
    song: {
      type: Object,
      required: true,
    },
  },
}
</script>

<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition
    duration-300 hover:bg-gray-50"
  >
    <div>
      <a href="#" class="font-bold block text-gray-600">
        {{ song.modifiedName }}
      </a>

      <span class="text-gray-500 text-sm">
        {{ song.displayName }}
      </span>
    </div>

    <div class="text-gray-600 text-lg">
      <span class="comments">
        <i class="fa fa-comments text-gray-600" />
        {{ song.commentCount }}
      </span>
    </div>
  </li>
</template>
