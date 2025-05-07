import About from '@/views/About.vue'
import { mount } from '@vue/test-utils'

describe('About.vue', () => {
  it('should render text', () => {
    const wrapper = mount(About, {
      shallow: true
    })

    expect(wrapper.text()).toContain('WIP')
    expect(wrapper.text()).toContain('GitHub')
    expect(wrapper.text()).toContain('LinkedIn')
  })
})
