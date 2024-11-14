import { computed } from 'vue'
import { useUser } from 'vue-clerk'
import { useUserSync } from '@/composables/user/useUserSync'

export const useAuth = () => {
  const { user, isLoaded } = useUser()
  const { isSignedIn } = useUserSync()

  const isAuthenticated = computed(() => isLoaded.value && user.value !== null)

  return {
    isSignedIn,
    isAuthenticated,
    user,
    isLoaded
  }
}