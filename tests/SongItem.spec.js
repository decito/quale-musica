import { RouterLinkStub, shallowMount } from "@vue/test-utils";
import SongItem from "@/components/SongItem.vue";

describe("SongItem.vue", () => {
  it("should render author's name", () => {
    const song = { displayName: "John Doe" };

    const wrapper = shallowMount(SongItem, {
      propsData: { song },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });

    const songAuthor = wrapper.find(".text-gray-500");

    expect(songAuthor.text()).toBe(song.displayName);
  });

  it("should render song with id equals to song-song.docID", () => {
    const song = { docID: "123foobartaz321" };

    const wrapper = shallowMount(SongItem, {
      propsData: { song },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });

    // expect(wrapper.classes()).toContain(`song-${song.docID}`);
    expect(wrapper.attributes().id).toBe(`song-${song.docID}`);
  });
});
