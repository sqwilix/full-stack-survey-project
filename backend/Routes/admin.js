import express from 'express'
import Users from '../Schema/UserSchema.js'
import { isAdmin, verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/users', verifyToken, isAdmin, async (req, res) => {
    const user = await Users.find().select('-password')
    res.json(user)
})

export default router