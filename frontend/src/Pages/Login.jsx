import { useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";


export default function Login() {
    const [form, setForm] = useState({email: '', password: ''})
    const [show, setShow] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const login = async (e) => {
        e.preventDefault()

        const {email, password} = form

        try {
            const result = await loginUser({email, password})

            localStorage.setItem('accessToken', result.accessToken)
            localStorage.setItem('user', JSON.stringify(result.user))
            window.dispatchEvent(new Event('storage'))

            setMessage(result.message)

            navigate('/profile')
        }catch(err) {
            setMessage(err.message)
        }   
    }

    return(
        <div className="container">
            <form onSubmit={login} className="form">
                <h2>Вход на аккаунт</h2>
                <input type="email" 
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    placeholder='Email'
                />
                <input type={show ? 'text' : 'password'} 
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    placeholder='Пароль'
                />
                <button className='toggle_btn' type="button" onClick={() => setShow(!show)}>{show ? 'Скрыть пароль' : 'Показать пароль'}</button>
                <button className='submit_btn' type="submit">Войти</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    )
}