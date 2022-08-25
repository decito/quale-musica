<script>
import Upload from "@/components/Upload.vue";
import CompositionItem from "@/components/CompositionItem.vue";
import { auth, songsCollection } from "@/includes/firebase";

export default {
  name: "Manage",
  components: {
    Upload,
    CompositionItem,
  },

  data() {
    return {
      songs: [],
      unsavedFlag: false,
    };
  },

  async created() {
    const snapshot = await songsCollection
      .where("uid", "==", auth.currentUser.uid)
      .get();

    snapshot.forEach(this.addSong);
  },

  methods: {
    updateSong(index, values) {
      this.songs[index].modifiedName = values.modifiedName;
      this.songs[index].genre = values.genre;
    },

    removeSong(index) {
      this.songs.splice(index, 1);
    },

    addSong(document) {
      const song = {
        ...document.data(),
        docID: document.id,
      };

      this.songs.push(song);
    },

    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },

  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      const answer = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      next(answer);
    }
  },

  // TODO: Close the form once the song has been updated
  // TODO: Remove file extension from the song name
};
</script>

<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <Upload ref="upload" :addSong="addSong" />
      </div>

      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">{{ $t("manage.cardTitle") }}</span>

            <i
              class="fas fa-compact-disc float-right text-green-400 text-2xl"
            />
          </div>

          <div class="p-6">
            <CompositionItem
              v-for="(song, index) in songs"
              :key="song.docID"
              :song="song"
              :updateSong="updateSong"
              :index="index"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
