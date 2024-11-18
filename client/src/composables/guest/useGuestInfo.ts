import { ref, watchEffect } from 'vue'
import { useUser } from 'vue-clerk'

export const useGuestInfo = () => {
  const { user } = useUser() 
  const firstName = ref('')
  const lastName = ref('')
  const email = ref('')
  
  watchEffect(() => {
    if (user.value) {
      firstName.value = user.value.firstName || ''
      lastName.value = user.value.lastName || ''
      email.value = user.value.emailAddresses[0]?.emailAddress || ''
    }
  })

  return {
    firstName,
    lastName,
    email
  }
}