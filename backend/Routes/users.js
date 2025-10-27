import validator from 'validator'
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import Users from '../Schema/UserSchema.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()
const SECRET_KEY = 'my_secret_key'
const REFRESH_SECRET = 'my_refresh_secret'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'avatar/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage})

router.get('/register', async(req, res) => {
    const users = await Users.find()
    res.json(users)
})

router.post('/register', async(req, res) => {
    try {
        const {name, password, email} = req.body
    
        if(!name || !password || !email) {
            return res.status(400).send({message: 'Заполните все поля'})
        }else if(!validator.isEmail(email)) {
            return res.status(400).send({message: 'Некорректный email'})
        }

        const exitingUser = await Users.findOne({email})
        if(exitingUser) {
            return res.status(400).send({message: 'Этот email уже используется в бд'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const isFirstUser = (await Users.countDocuments() === 0)
        const user = await Users.create({
            name,
            email,
            password: hashedPassword,
            role: isFirstUser ? 'admin' : 'user'
        })

        console.log('Роль создаваемого пользователя:', user.role);

        const accessToken = jwt.sign(
            {id: user._id, role: user.role},
            SECRET_KEY,
            {expiresIn: '15m'}
        )

        const refreshToken = jwt.sign(
            {id: user._id},
            REFRESH_SECRET,
            {expiresIn: '7d'}
        )

        user.refreshToken = refreshToken
        await user.save()

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(201).json({
            message: 'Регистрация успешна',
            accessToken,
            user: {id: user._id, name: user.name, email: user.email, role: user.role}
        })
    }catch(err) {
        console.error(err);
        res.status(500).send({message: 'Ошибка сервера'})
    }
})

router.post('/login', async(req, res) => {
    try {
        const {email, password} = req.body

        const user = await Users.findOne({email}).select('+password')
        if(!user) {
            return res.status(400).send({message: 'Некорректный email'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(400).send({message: 'Неправильный пароль'})
        }

        const accessToken = jwt.sign(
            {id: user._id, role: user.role},
            SECRET_KEY,
            {expiresIn: '15m'}
        )

        const refreshToken = jwt.sign(
            {id: user._id},
            REFRESH_SECRET,
            {expiresIn: '7d'}
        )

        user.refreshToken = refreshToken
        await user.save()

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.json({
            message: 'Успешный вход',
            accessToken,
            user: {id: user._id, name: user.name, email: user.email}
        })

    }catch(err) {
        console.error(err);
        res.status(500).send({message: 'Ошибка сервера'})
    }
})

router.put('/update', verifyToken, upload.single('avatar'), async(req, res) => {
    try {
        const {name, email} = req.body
        const avatar = req.file ? `http://localhost:5000/avatar/${req.file.filename}` : undefined

        const updateUser = await Users.findByIdAndUpdate(
            req.user._id,
            {name, email, ...(avatar && {avatar})},
            {new: true}
        )

        if(!updateUser) return res.status(404).send({message: 'Пользователь не найден'})

        res.json({
            message: 'Данные успешно обновлены',
            user: updateUser
        })
    }catch(err) {
        res.status(401).send({message: 'Ошибка при обновлении пользователя'})
    }
})

export default router