import express from 'express'
import User from '../models/User'
import { clerkClient } from '@clerk/clerk-sdk-node'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { clerkUserId } = req.body;
    const clerkUser = await clerkClient.users.getUser(clerkUserId)
    const username = clerkUser?.username || clerkUser?.firstName + ' ' + clerkUser?.lastName || 'Unknown'
    const email = clerkUser?.emailAddresses[0]?.emailAddress || 'unknown@example.com'
    
    let user = await User.findOne({ clerkUserId })
    if (!user) {
      user = new User({ clerkUserId, username, email })
      await user.save()
    }
    res.status(201).json(user)
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(400).json({ message: 'Error creating user', error })
  }
})

export default router