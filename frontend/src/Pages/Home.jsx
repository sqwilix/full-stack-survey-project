import { useEffect, useState } from "react"
import { data, Link } from "react-router-dom"

export default function Home() {
    const [surveys, setSurveys] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
            fetch('http://localhost:5000/survey')
            .then(res => res.json())
            .then(data => {
                setSurveys(data)
                setLoading(false)
            })
            .catch(err => {
                setError('Ошибка при загрузке опросов', err)
                setLoading(false)
            })
    }, [])

    if(loading) return <h2>Загрузка...</h2>
    if(error) return <p style={{color: 'red'}}>{error}</p>

    return(
        <div className="home_container">
            <ul className="survey_items">
                {surveys.map((s) => (
                    <li className="survey_item" key={s._id}>
                        {s.image && (
                            <img src={`http://localhost:5000${s.image}`} alt="uploads" />
                        )}
                        <h3>{s.title}</h3>
                        <p>{s.description}</p>
                        <button className="take_survey_btn"><Link to={`/survey/${s._id}`} >Пройти опрос</Link></button>
                    </li>
                ))}
            </ul>
        </div>
    )
}