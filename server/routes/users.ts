import express from 'express'
import User from '../models/User'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { username, email, clerkUserId } = req.body
    const user = new User({ username, email, clerkUserId })
    await user.save()
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error })
  }
})

export default router