import { watch } from 'vue'
import { useUser } from 'vue-clerk'
import { syncUserWithDatabase } from '../../services/userService'

//watches for changes in user authentication state and syncs the user with the database if signed in 
export const useUserSync = () => {
    const { isSignedIn, user } = useUser()

    watch([isSignedIn, user], async ([newIsSignedIn, newUser]) => {
        if(newIsSignedIn && newUser) {
            try {
                //syncs the user with database using clerk id
                await syncUserWithDatabase(newUser.id)
            } catch (error) {
                console.error('Error syncing user with database:', error)
            }
        }
    }, { immediate: true })

    return {
        isSignedIn,
        user
    }
}