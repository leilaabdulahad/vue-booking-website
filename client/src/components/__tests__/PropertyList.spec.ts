import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import PropertyList from '@/components/PropertyList.vue';
import axios from 'axios';

vi.mock('axios');

describe('PropertyList', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a list of properties fetched from the API', async () => {
    const mockProperties = [
      {
        _id: '1',
        title: 'Beautiful Apartment',
        description: 'A nice place to live.',
        location: 'New York',
        username: 'john_doe',
        createdAt: '2023-09-20T12:00:00Z',
      },
      // Add more mock properties if needed
    ];

    vi.mocked(axios.get).mockResolvedValue({ data: mockProperties });

    const wrapper = mount(PropertyList);

    await flushPromises();

    expect(wrapper.text()).toContain('Beautiful Apartment');
    expect(wrapper.text()).toContain('A nice place to live.');
    expect(wrapper.text()).toContain('New York');
    expect(wrapper.text()).toContain('Posted by: john_doe');
    // Note: The exact date format might differ based on locale settings
    expect(wrapper.text()).toContain('Posted on:');
    expect(wrapper.text()).toContain('9/20/2023');
  });

  it('handles errors during fetching', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(axios.get).mockRejectedValue(new Error('Error fetching properties'));

    const wrapper = mount(PropertyList);

    await flushPromises();

    expect(console.error).toHaveBeenCalledWith('Error fetching properties:', expect.any(Error));
  });
});