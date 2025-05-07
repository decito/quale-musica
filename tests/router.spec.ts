import SongItem from '@/components/SongItem.vue'
import { RouterLinkStub, shallowMount } from '@vue/test-utils'

describe('Router', () => {
  it('should render the router link', () => {
    const song = {
      docID: '123foobartaz321'
    }

    const wrapper = shallowMount(SongItem, {
      props: { song },
      global: {
        components: {
          'router-link': RouterLinkStub
        }
      }
    })

    expect(wrapper.findComponent(RouterLinkStub).props().to).toEqual({
      name: 'song',
      params: { id: song.docID }
    })
  })
})
