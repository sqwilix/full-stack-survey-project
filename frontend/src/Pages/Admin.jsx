import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Admin() {
    const [surveys, setSurveys] = useState([])
    const [error, setError] = useState('')
    const [editingSurveys, setEditingSurveys] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const res = await fetch('http://localhost:5000/admin/users', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                })

                if(!res.ok) throw new Error('У вас нет доступа к админке')

                const surveyRes = await fetch('http://localhost:5000/survey')
                const surveyData = await surveyRes.json()
                setSurveys(surveyData)
            }catch(err) {
                alert(err.message)
                navigate('/')
            }
        }
        fetchSurvey()
    }, [])

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/survey/${id}`, {
                method: "DELETE",
            })

            const data = await res.json()

            if(!res.ok) throw new Error(data.message || 'Ошибка при удалении')

            setSurveys((prev) => prev.filter((s) => s._id !== id))
        }catch(err) {
            setError(err.message)
        }
    }

    if(error) return <p style={{color: 'red'}}>{error}</p>

    return(
        <div className="admin_container">
            <h2>Админ панель</h2>
            <button className="add_surveys_btn"><Link to='/admin/surveys'>Создать опрос</Link></button>

            <ul className="survey_items">
                {surveys.map((s) => (
                    <li className="survey_item" key={s._id}>
                        {s.image && (
                            <img src={`http://localhost:5000${s.image}`} alt="uploads" />
                        )}
                        <h3>{s.title}</h3>
                        <p>{s.description}</p>
                        <br />
                        <button className="edit_btn" onClick={() => setEditingSurveys(s)}><Link to={`/admin/surveys/${s._id}`}>Редактировать</Link></button>
                        <button className="delete_btn" onClick={() => handleDelete(s._id)}>Удалить опрос</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}