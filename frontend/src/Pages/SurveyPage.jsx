import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function SurveyPage() {
    const {id} = useParams()
    const [survey, setSurvey] = useState(null)
    const [answers, setAnswers] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`http://localhost:5000/survey/${id}`)
        .then(res => res.json())
        .then(data => setSurvey(data))
        .catch(err => setError('Ошибка при загрузке опроса'))
    }, [id])

    const handleAnswer = (qIndex, oIndex) => {
        setAnswers(prev => ({...prev, [qIndex] : oIndex}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!survey) return

        try {
            const res = await fetch('http://localhost:5000/survey/submit', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({surveyId: id, answers})
            })

            const data = await res.json()
            if(!res.ok) throw new Error(data.message || 'Ошибка при отправке')

            setSubmitted(true)
        }catch(err) {
            setError(err.message)
        }
    }

    if(error) return <h2 style={{color: 'red'}}>{error}</h2>
    if(!survey) return <p>Загрузка...</p>

    if(submitted) {
        return (
           <div className="survey_done">
                <h2>Списибо за прохождение опроса</h2>
                <button className="go_back_btn" onClick={() => navigate('/')}>Вернуться на главную</button>
           </div> 
        )
    }

    return(
        <div className="take_survey_container">
            <h2>{survey.title}</h2>
            <p>{survey.description}</p>
            {survey.image && (
                <img style={{width: '200px', height: '200px', border: '2px solid white', borderRadius: '50%'}} src={`http://localhost:5000${survey.image}`} alt="uploads" />
            )}

            <form onSubmit={handleSubmit}>
                {survey.questions.map((q, qIndex) => (
                    <div className="survey_question_block" key={qIndex}>
                        <h2 className="question_title">{`Вопрос ${qIndex + 1}`}: {q.questionText}</h2>
                        <div className="options">
                            {q.options.map((opt, oIndex) => (
                                <label key={oIndex} className="option_label">
                                    <input className="radio_input" type="radio" 
                                        name={`question-${qIndex}`}
                                        checked={answers[qIndex] === oIndex}
                                        onChange={() => handleAnswer(qIndex, oIndex)}
                                    />
                                    {opt.text}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
                <button type="submit" className="submit_btn">Отправить ответы</button>
            </form>
        </div>
    )
}