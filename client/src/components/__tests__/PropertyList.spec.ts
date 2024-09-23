import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import PropertyList from '@/components/PropertyList.vue'
import axios from 'axios'

vi.mock('axios')

describe('PropertyList', () => {
  const mockProperties = [
    {
      _id: '1',
      title: 'Beautiful Apartment',
      description: 'A nice place to live.',
      location: 'New York',
      username: 'john_doe',
      createdAt: '2023-09-20T12:00:00Z',
    },
    {
      _id: '2',
      title: 'Cozy House',
      description: 'A cozy house in the suburbs.',
      location: 'Los Angeles',
      username: 'jane_doe',
      createdAt: '2023-09-21T12:00:00Z',
    },
    {
      _id: '3',
      title: 'Luxury Villa',
      description: 'A luxurious villa with a pool.',
      location: 'Miami',
      username: 'john_smith',
      createdAt: '2023-09-22T12:00:00Z',
    }
  ]

  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders a list of properties fetched from the API', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockProperties })
    const wrapper = mount(PropertyList)
    await flushPromises()

    expect(wrapper.text()).toContain('Beautiful Apartment')
    expect(wrapper.text()).toContain('A nice place to live.')
    expect(wrapper.text()).toContain('New York')
    expect(wrapper.text()).toContain('Posted by: john_doe')
    expect(wrapper.text()).toContain('Posted on:')
    expect(wrapper.text()).toContain('9/20/2023')
  })

  it('handles errors during fetching', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(axios.get).mockRejectedValue(new Error('Error fetching properties'))
    const wrapper = mount(PropertyList)
    await flushPromises()

    expect(console.error).toHaveBeenCalledWith('Error fetching properties:', expect.any(Error))
  })

it('displays a loading state while fetching properties', async () => {
  vi.mocked(axios.get).mockImplementation(() => new Promise(() => {}))
  const wrapper = mount(PropertyList)
  
  await wrapper.vm.$nextTick()
  
  expect(wrapper.text()).toContain('Loading...')
  expect(wrapper.text()).not.toContain('No properties available')
})

it('displays a message when no properties are available', async () => {
  vi.mocked(axios.get).mockResolvedValue({ data: [] })
  const wrapper = mount(PropertyList)
  
  await flushPromises()
  await wrapper.vm.$nextTick()
  
  expect(wrapper.text()).toContain('No properties available')
  expect(wrapper.text()).not.toContain('Loading...')
})

  it('renders the correct number of property items', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockProperties })
    const wrapper = mount(PropertyList)
    await flushPromises()

    const propertyItems = wrapper.findAll('.property-item')
    expect(propertyItems).toHaveLength(3)
  })

  it('handles missing property data gracefully', async () => {
    const incompleteProperty = [
      { _id: '1', title: 'Property with missing data' },
    ]
    vi.mocked(axios.get).mockResolvedValue({ data: incompleteProperty })
    const wrapper = mount(PropertyList)
    await flushPromises()

    expect(wrapper.text()).toContain('Property with missing data')
    expect(wrapper.text()).toContain('Unknown user')
    expect(wrapper.text()).not.toContain('undefined')
  })

  it('formats the date correctly', async () => {
    const propertyWithDate = [
      {
        _id: '1',
        title: 'Test Property',
        createdAt: '2023-09-20T12:00:00Z',
      },
    ]
    vi.mocked(axios.get).mockResolvedValue({ data: propertyWithDate })
    const wrapper = mount(PropertyList)
    await flushPromises()

    expect(wrapper.text()).toMatch(/Posted on:.*9\/20\/2023/)
  })
})