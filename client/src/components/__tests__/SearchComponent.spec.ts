import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import SearchComponent from '../SearchFilter.vue'
import debounce from 'lodash/debounce'

// Mock debounce to make it execute immediately
vi.mock('lodash/debounce', () => ({
  default: vi.fn((fn) => fn),
}))

describe('SearchComponent', () => {
  it('renders an input element', () => {
    const wrapper = mount(SearchComponent)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('updates searchQuery when input value changes', async () => {
    const wrapper = mount(SearchComponent)
    const input = wrapper.find('input')
    await input.setValue('New York')
    expect(wrapper.vm.searchQuery).toBe('New York')
  })

  it('emits search event with debounce when input changes', async () => {
    const wrapper = mount(SearchComponent)
    const input = wrapper.find('input')
    await input.setValue('London')
    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')![0]).toEqual(['London'])
  })

  it('uses debounce function', () => {
    mount(SearchComponent)
    expect(debounce).toHaveBeenCalledWith(expect.any(Function), 300)
  })
})