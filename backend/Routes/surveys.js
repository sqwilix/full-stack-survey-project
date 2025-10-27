import multer from "multer";
import express from 'express'
import path from 'path'
import fs from 'fs'
import requestIp from 'request-ip'
import Survey from "../Schema/SurveySchema.js";
import Response from "../Schema/ResponseSchema.js";

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => 
        cb(null, Date.now() + path.extname(file.originalname))
})

const upload = multer({storage})

router.get('/', async(req, res) => {
    try {
        const survey = await Survey.find().sort({createdAt: -1})
        res.json(survey)
    }catch {
        res.status(500).send({message: 'Ошибка при получении опросов'})
    }
})

router.post('/', upload.single('image'), async(req, res) => {
    try {
        const {title, description} = req.body
        let {questions} = req.body

        if(typeof questions === 'string') {
            questions = JSON.parse(questions)
        }

        if(!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).send({message: 'Вопросы не переданы'})
        }
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null

        const newSurvey = new Survey({
            title, 
            description, 
            image: imagePath, 
            questions
        })

        await newSurvey.save()

        res.json(newSurvey)
    }catch(err) {
        console.error('Ошибка при создании опроса', err);
        res.status(500).send({message: 'Ошибка при создании опроса'})
    }
})

router.delete('/:id', async(req, res) => {
    try {
        const survey = await Survey.findById(req.params.id)
        if(!survey) {
            return res.status(404).send({message: 'Опрос не найден'})
        }

        if(survey.image) {
            const filePath = path.join('.', survey.image)
            fs.unlink(filePath, (err) => {
                if(err) console.error('Ошибка при удалении опроса', err)
            })
        }
        await Survey.findByIdAndDelete(req.params.id)
        res.json({message: 'Опрос удален'})
    }catch {
        res.status(500).send({message: 'Ошибка при удалении опроса'})
    }
})

router.put('/:id', upload.single('image'), async(req, res) => {
    try {
        const {title, description, questions} = req.body
        const updateData = {title, description}

        if(req.file) {
            updateData.image = `/uploads/${req.file.filename}`
        }

        if(questions) {
            updateData.questions = typeof questions === 'string' ? JSON.parse(questions) : questions
        }

        const updatedSurvey = await Survey.findByIdAndUpdate(
            req.params.id,
            updateData,
            {new: true}
        )

        if(!updatedSurvey) {
            return res.status(404).send({message: 'Опрос не найден'})
        }

        res.json(updatedSurvey)
    }catch(err) {
        console.error(err);
        res.status(500).send({message: 'Ошибка при обновлении запроса'})
    }
})

router.get('/:id', async(req, res) => {
    try {
        const survey = await Survey.findById(req.params.id)
        if(!survey) {
            return res.status(404).send({message: 'Опрос не найден'})
        }
        res.json(survey)
    }catch(err) {
        console.error(err);
        res.status(500).send({message: 'Ошибка при получении опроса'})
    }
})

router.post('/submit', async(req, res) => {
    try {
        const {surveyId, answers} = req.body
        if(!surveyId || !answers) {
            return res.status(400).send({message: 'Не хвататет данных для сохранения ответа'})
        }

        const ip = requestIp.getClientIp(req)
        const userAgent = req.headers['user-agent']

        const response = new Response({
            surveyId,
            answers: Object.entries(answers).map(([qIndex, oIndex]) => ({
                questionIndex: Number(qIndex),
                optionIndex: Number(oIndex)
            })),
            ip,
            userAgent
        })

        await response.save()
        res.json({message: 'Ответы успешно сохранены'})
    }catch(err) {
        console.error('Ошибка при сохранении ответа:', err);
        res.status(500).json({ message: 'Ошибка при сохранении ответа' })
    }
})

export default router