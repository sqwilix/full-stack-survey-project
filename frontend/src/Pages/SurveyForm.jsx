import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SurveyForm({ survey, setSurvey }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null)
    const [questions, setQuestions] = useState([])
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const {id} = useParams()

    useEffect(() => {
        if(id) {
            fetch(`http://localhost:5000/survey/${id}`)
            .then(res => res.json())
            .then(data => {
                setTitle(data.title)
                setDescription(data.description)
                setQuestions(data.questions || [])
            })
            .catch(err => console.error(err))
        }
    }, [id])

    const addQuestions = () => {
        setQuestions([
            ...questions,
            {questionText: '', options: [{text: '', isCorrect: false}]}
        ])
    }

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index))
    }

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions]
        newQuestions[index].questionText = value
        setQuestions(newQuestions)
    }

    const addOption = (qIndex) => {
        const newQuestions = [...questions]
        newQuestions[qIndex].options.push({text: '', isCorrect: false})
        setQuestions(newQuestions)
    }

    const handleOptionsChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions]
        newQuestions[qIndex].options[oIndex].text = value
        setQuestions(newQuestions)
    }

    const toggleCorrect = (qIndex, oIndex) => {
        const newQuestions = [...questions]
        newQuestions[qIndex].options = newQuestions[qIndex].options.map((opt, idx) => ({
            ...opt,
            isCorrect: idx === oIndex
        }))
        setQuestions(newQuestions)
    }

    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...questions]
        newQuestions[qIndex].options.splice(oIndex, 1)
        setQuestions(newQuestions)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
    
        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        if(image) formData.append('image', image)
        formData.append('questions', JSON.stringify(questions))
    
        const url = id
        ? `http://localhost:5000/survey/${id}`
        : 'http://localhost:5000/survey'
        const method = id ? "PUT" : "POST"
    
        try {
            const res = await fetch(url, { method, body: formData})
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Ошибка при сохранении')

            navigate("/admin")
    
        }catch(err) {
            setError(err.message)
        }
    
    }
    return(
        <div className="container">
            <h2>{id ? 'Редактировать опрос' : 'Добавить опрос'}</h2>
            <form onSubmit={handleSubmit} className="form">
                <input type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Название опроса"
                    required
                />
                <br />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Описание опроса" required></textarea>
                <br />
                <input type="file" onChange={(e) => setImage(e.target.files[0])}/>
                <br />
                <h3>Вопросы</h3>
                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="question_block">
                        <input type="text" 
                            placeholder={`Вопрос ${qIndex + 1}`}
                            value={q.questionText}
                            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                            required
                        />
                        <button type="button" onClick={() => removeQuestion(qIndex)}>Удалить вопрос</button>
                        <div className="options">
                            {q.options.map((opt, oIndex) => (
                                <div className="option" key={oIndex}>
                                    <input type="text" 
                                        placeholder={`Вариант ${oIndex + 1}`}
                                        value={opt.text}
                                        onChange={(e) => handleOptionsChange(qIndex, oIndex, e.target.value)}
                                        required
                                    />
                                    <input type="radio" 
                                        name={`correct-${qIndex}`}
                                        checked={opt.isCorrect}
                                        onChange={(e) => toggleCorrect(qIndex, oIndex)}
                                    />
                                    <button type="button" onClick={() => removeOption(qIndex, oIndex)}>🗑️</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addOption(qIndex)}>Добавить вариант</button>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addQuestions}>Добавить вопрос</button>
                <br />
                <button className="add_surveys_btn" type="submit">{id ? 'Сохранить изменения' : 'Добавить опрос'}</button>
            </form>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    )
}