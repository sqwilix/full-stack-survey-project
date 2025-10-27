import jwt from 'jsonwebtoken'
import Users from '../Schema/UserSchema.js'

const SECRET_KEY = 'my_secret_key'

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Нет токена'})
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, SECRET_KEY)
        req.user = await Users.findById(decoded.id)
        if(!req.user) return res.status(404).json({message: 'Пользователь не найден'})
        next()
    }catch(err) {
        res.status(403).json({message: 'Недействительный токен'})
    }
}

export const isAdmin = async (req, res, next) => {
    console.log('Роль пользователя:', req.user.role);
    if (req.user.role !== 'admin') return res.status(403).json({message: 'Доступ запрещен, вы не админ'})

    next()
}