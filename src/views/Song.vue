<script>
import { auth, commentsCollection, songsCollection } from "@/includes/firebase";
import { mapActions, mapState } from "pinia";
import useUserStore from "@/stores/user";
import usePlayerStore from "@/stores/player";

export default {
  name: "Song",

  data() {
    return {
      song: {},
      schema: { comment: "required|min:10" },
      commentInSubmmition: false,
      commentShowAlert: false,
      commentAlertVariant: "bg-blue-500",
      commentAlertMessage: "Please wait. Your comment is being submitted.",
      comments: [],
      sort: "1",
    };
  },

  computed: {
    ...mapState(useUserStore, ["userLoggedIn"]),

    ...mapState(usePlayerStore, [
      "currentSong",
      "isCurrentPlaying",
      "toggleAudio",
    ]),

    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === "1") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }

        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    },
  },

  methods: {
    ...mapActions(usePlayerStore, ["newSong"]),

    async getComments() {
      const snapshots = await commentsCollection
        .where("songId", "==", this.$route.params.id)
        .get();

      this.comments = [];

      snapshots.forEach((doc) => {
        this.comments.push({
          docID: doc.id,
          ...doc.data(),
        });
      });
    },

    async addComment(values, { resetForm }) {
      this.commentInSubmmition = true;
      this.commentShowAlert = true;
      this.commentAlertVariant = "bg-blue-500";
      this.commentAlertMessage =
        "Please wait. Your comment is being submitted...";

      const comment = {
        content: values.comment,
        createdAt: new Date().toString(),
        songId: this.$route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      };

      console.log(comment);

      await commentsCollection.add(comment);

      this.song.commentCount += 1;

      await songsCollection.doc(this.$route.params.id).update({
        commentCount: this.song.commentCount,
      });

      this.commentInSubmmition = false;
      this.commentAlertVariant = "bg-green-500";
      this.commentAlertMessage = "Comment added!";

      this.getComments();

      resetForm();
    },

    songAction(song) {
      this.isCurrentPlaying || this.currentSong.songID === this.$route.params.id
        ? this.toggleAudio()
        : this.newSong(song);
    },
  },

  async beforeRouteEnter(to, from, next) {
    const snapshot = await songsCollection.doc(to.params.id).get();

    next((vm) => {
      if (!snapshot.exists) {
        vm.$router.push({ name: "home" });
        return;
      }

      const { sort } = vm.$route.query;
      vm.sort = sort === "1" || sort === "2" ? sort : "1";

      vm.song = snapshot.data();
      vm.song.songID = vm.$route.params.id;
      vm.getComments();
    });
  },

  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return;
      }

      this.$router.push({ query: { sort: newVal } });
    },
  },
};
</script>

<template>
  <main>
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-cover music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      />

      <div class="container mx-auto flex items-center">
        <button
          type="button"
          class="z-10 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
          @click.prevent="songAction(song)"
        >
          <i class="fas" :class="isCurrentPlaying ? 'fa-pause' : 'fa-play'" />
        </button>

        <div class="z-20 text-left ml-8">
          <div class="text-3xl font-bold">{{ song.modifiedName }}</div>

          <div>{{ song.genre }}</div>
        </div>
      </div>
    </section>

    <section id="comments" class="container mx-auto mt-6">
      <div
        class="bg-white dark:text-white dark:bg-stone-700 rounded border border-gray-200 dark:border-gray-500 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title">
            {{
              $tc("song.commentCount", song.commentCount, {
                count: song.commentCount,
              })
            }}
          </span>

          <i class="fas fa-comments float-right text-green-400 text-2xl" />
        </div>

        <div class="p-6">
          <div
            v-if="commentShowAlert"
            class="text-white text-center font-bold p-4 mb-4"
            :class="commentAlertVariant"
          >
            {{ commentAlertMessage }}
          </div>

          <VeeForm
            v-if="userLoggedIn"
            :validation-schema="schema"
            @submit="addComment"
          >
            <VeeField
              as="textarea"
              name="comment"
              class="block w-full dark:bg-stone-600 py-1.5 px-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-500 transition duration-500 focus:outline-none focus:border-black dark:focus:border-gray-700 rounded mb-4"
              placeholder="Your comment here..."
            >
            </VeeField>

            <ErrorMessage name="comment" class="text-red-600" />

            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="commentInSubmmition"
            >
              Submit
            </button>
          </VeeForm>

          <select
            v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>

    <ul class="container mx-auto pt-4">
      <li
        v-for="comment in sortedComments"
        :key="comment.docID"
        class="p-6 bg-gray-50 border border-gray-200 dark:border-gray-500 dark:bg-stone-700 rounded dark:text-white"
      >
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>

          <time>{{ comment.createdAt }}</time>
        </div>

        <p>{{ comment.content }}</p>
      </li>
    </ul>
  </main>
</template>
