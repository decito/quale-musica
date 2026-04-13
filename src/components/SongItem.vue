<script setup lang="ts">
import { limitText } from "@/includes/formatters";
import { readCover } from "@/lib/queries/read-cover";
import type { Song } from "@/types";
import { onMounted, ref } from "vue";

const props = defineProps<{ song: Song }>();

const coverSrc = ref("/assets/img/frame-dark.png");

const formatText = (value: string) => {
  return limitText(value);
};

onMounted(async () => {
  if (!props.song.coverId) {
    coverSrc.value = "/assets/img/frame-dark.png";
    return;
  }
  coverSrc.value = "/assets/img/frame-dark.png";

  const snapshot = await readCover(props.song.coverId);

  coverSrc.value = snapshot!.fileUrl;
});
</script>

<template>
  <li
    :id="`song-${song.docID}`"
    class="cursor-pointer rounded-sm bg-gray-200 transition duration-300 hover:bg-gray-50 dark:bg-stone-700 dark:hover:bg-stone-600"
  >
    <router-link
      :to="{ name: 'song', params: { id: song.docID } }"
      class="flex flex-col items-center justify-between font-semibold text-gray-700 dark:text-gray-100"
    >
      <header>
        <div>
          <img :src="coverSrc" alt="cover" />
        </div>
      </header>

      <footer class="w-full p-3">
        <div>
          <p>{{ formatText(song.modifiedName) }}</p>
          <span class="text-sm text-gray-500 dark:text-gray-300">
            {{ song.displayName }}
          </span>
        </div>
        <div class="text-gray-600 dark:text-gray-100">
          <router-link
            v-slot="{ navigate }"
            custom
            :to="{
              name: 'song',
              params: { id: song.docID },
              hash: '#comments',
            }"
          >
            <span class="comments" @click="navigate">
              <i class="fas fa-comments text-gray-600 dark:text-gray-100" />
              {{ song.commentCount }}
            </span>
          </router-link>
        </div>
      </footer>
    </router-link>
  </li>
</template>
