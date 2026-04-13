<script setup lang="ts">
import SongItemLoading from "@/components/song/SongItemLoading.vue";
import SongItem from "@/components/SongItem.vue";
import { auth } from "@/includes/firebase";
import { readSongsWithLimit } from "@/lib/queries/read-songs";
import type { Song } from "@/types";
import { onBeforeMount, onBeforeUnmount, ref } from "vue";

const songs = ref<Song[]>([]);
const username = ref("");
const limitPerRequest = ref(25);
const isLoading = ref(false);
const isFirstRequest = ref(true);

const handleScroll = () => {
  const { scrollTop, offsetHeight } = document.documentElement;
  const { innerHeight } = window;
  const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

  if (bottomOfWindow) {
    getSongs();
  }
};

const getSongs = async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  const arr: Song[] = [];

  const docs = await readSongsWithLimit(isFirstRequest.value, limitPerRequest.value);
  docs.forEach((doc) => {
    arr.push(doc);
  });
  songs.value = arr;

  isFirstRequest.value = false;
  isLoading.value = false;
};

onBeforeMount(() => {
  getSongs();

  if (auth.currentUser) {
    username.value = `, ${auth.currentUser.displayName}`;
  }
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <main>
    <section class="container mx-auto">
      <div class="mt-12 dark:text-white">
        <span class="pl-2 text-2xl font-bold">Hi there{{ username && `, ${username}` }}!</span>
      </div>
      <div v-if="isLoading" class="grid grid-cols-3 gap-8 pt-20 md:grid-cols-5 lg:grid-cols-6">
        <SongItemLoading v-for="(sklt, i) in 6" :key="i" />
      </div>
      <ol
        v-else-if="songs.length"
        class="grid w-full grid-cols-3 gap-8 pt-20 md:grid-cols-5 lg:grid-cols-6"
      >
        <SongItem v-for="song in songs" :key="song.uid" :song="song" />
      </ol>
      <div v-else class="flex w-full pt-20 text-center dark:text-white">
        <p class="w-full">No songs found in our library.</p>
      </div>
    </section>
  </main>
</template>
