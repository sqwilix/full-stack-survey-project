import { useState } from 'react'
import { registerUser } from '../api'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
    const [form, setForm] = useState({name: '', email: '', password: ''})
    const [show, setShow] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const reg = async (e) => {
        e.preventDefault()

        const {name, email, password} = form

        try {
            const result = await registerUser({name, email, password})

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
        <div className='container'>
            <form className='form' onSubmit={reg}>
                <h2>Регистрация</h2>
                <input type="text" 
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    placeholder='Имя'
                />
                <input type="email" 
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    placeholder='Email'
                />
                <input type={show ? 'text' : 'password'} 
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    placeholder='Пароль'
                />
                <button className='toggle_btn' type="button" onClick={() => setShow(!show)}>{show ? 'Скрыть пароль' : 'Показать пароль'}</button>
                <button className='submit_btn' type="submit">Зарегистрироваться</button>
                <span className='login_transition'><Link to='/login'>Есть аккаунт?</Link></span>
            </form>
            {message && <p className='message'>{message}</p>}
        </div>
    )
}