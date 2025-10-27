import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import path from 'path'
import users from './Routes/users.js'
import admin from './Routes/admin.js'
import survey from './Routes/surveys.js'

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

mongoose.connect('mongodb://localhost:27017/login_project')
  .then(() => console.log('✅ MongoDB подключена'))
  .catch(err => console.error('❌ Ошибка подключения MongoDB:', err))

app.use('/users', users)
app.use('/admin', admin)
app.use('/survey', survey)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/avatar', express.static(path.join(process.cwd(), 'avatar')))

const PORT = 5000
app.listen(PORT, () => console.log(`🚀 Сервер запущен: http://localhost:${PORT}`))
