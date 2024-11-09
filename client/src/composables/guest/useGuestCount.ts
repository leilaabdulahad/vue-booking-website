import { initial } from 'lodash'
import { ref } from 'vue'

export const useGuestCount = (initialCount: number = 1) => {
    const guestCount = ref(initialCount)
    const isDropdownOpen = ref(false)

    const incrementGuests = () => {
        guestCount.value++
        return guestCount.value
    }

    const decrementGuests = () => {
        if(guestCount.value > 1) {
            guestCount.value--
        }
        return guestCount.value
    }

    const toggleDropdown = () => {
        isDropdownOpen.value = !isDropdownOpen.value
    }

    const closeDropdown = (event: Event) => {
        if (!(event.target as HTMLElement).closest('.guest-filter')){
            isDropdownOpen.value = false
        }
    }

    return {
        guestCount,
        isDropdownOpen,
        incrementGuests,
        decrementGuests,
        toggleDropdown,
        closeDropdown
    }

}