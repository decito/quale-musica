<script>
import { songsCollection } from "@/includes/firebase";
import SongItem from "@/components/SongItem.vue";
import { auth } from "@/includes/firebase";

export default {
  name: "Home",

  components: {
    SongItem,
  },

  data() {
    return {
      songs: [],
      username: "",
      maxPerScroll: 25,
      isPendingRequest: false,
    };
  },

  async created() {
    this.getSongs();

    if (auth.currentUser) {
      this.username = `, ${auth.currentUser.displayName}`;
    }
    window.addEventListener("scroll", this.handleScroll);
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  methods: {
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const bottomOfWindow =
        Math.round(scrollTop) + innerHeight === offsetHeight;

      if (bottomOfWindow) {
        this.getSongs();
      }
    },

    async getSongs() {
      if (this.isPendingRequest) {
        return;
      }

      this.isPendingRequest = true;

      let snapshots;

      if (this.songs.length) {
        const lastDoc = await songsCollection
          .doc(this.songs[this.songs.length - 1].docID)
          .get();

        snapshots = await songsCollection
          .orderBy("modifiedName")
          .startAfter(lastDoc)
          .limit(this.maxPerScroll)
          .get();
      } else {
        snapshots = await songsCollection
          .orderBy("modifiedName")
          .limit(this.maxPerScroll)
          .get();
      }

      snapshots.forEach((document) => {
        this.songs.push({
          docID: document.id,
          ...document.data(),
        });
      });

      this.isPendingRequest = false;
    },
  },
};
</script>

<template>
  <main>
    <section class="container mx-auto">
      <div class="dark:text-white mt-12">
        <span class="pl-2 font-bold text-2xl">Hi there{{ username }}!</span>
      </div>

      <ol
        id="playlist"
        class="pt-20 grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-8"
      >
        <SongItem v-for="song in songs" :key="song.docID" :song="song" />
      </ol>
    </section>
  </main>
</template>
