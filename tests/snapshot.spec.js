import { RouterLinkStub, shallowMount } from "@vue/test-utils";
import SongItem from "@/components/SongItem.vue";

describe("Snapshot of SongItem.vue", () => {
  it("should render correctly", () => {
    const song = {
      docID: "123foobartaz321",
      modifiedName: "Modified Name",
      displayName: "Display Name",
      commentCount: 13,
    };

    const wrapper = shallowMount(SongItem, {
      propsData: { song },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });
});
