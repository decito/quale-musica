import SongItem from '@/components/SongItem.vue'
import Home from '@/views/Home.vue'
import { shallowMount } from '@vue/test-utils'

describe('Home.vue', () => {
  it('should render list of songs', () => {
    const songs = [{}, {}, {}]

    const component = shallowMount(Home, {
      data() {
        return {
          songs
        }
      },
      global: {
        mocks: {
          $t: (message) => message
        }
      }
    })

    const items = component.findAllComponents(SongItem)

    expect(items).toHaveLength(songs.length)

    items.forEach((wrapper, index) => {
      expect(wrapper.props().song).toStrictEqual(songs[index])
    })
  })
})
