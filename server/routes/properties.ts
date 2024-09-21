import express from 'express'
import Post from '../models/Property'
import User from '../models/User'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { title, description, location, clerkUserId } = req.body
    
    let user = await User.findOne({ clerkUserId })
    if (!user) {

      user = new User({ clerkUserId, username: 'Unknown', email: 'unknown@example.com' })
      await user.save();
    }
    
    const post = new Post({ title, description, location, userId: user._id })
    await post.save()
    res.status(201).json(post)
  } catch (error) {
    res.status(400).json({ message: 'Error creating post', error })
  }
})


router.get('/', async (_req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('userId', 'username')
    
    const postsWithUserInfo = posts.map(post => ({
      ...post.toObject(),
      user: post.userId ? { username: (post.userId as any).username } : null
    }))

    res.json(postsWithUserInfo)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error })
  }
})

export default router
