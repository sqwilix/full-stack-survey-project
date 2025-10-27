import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

export default function Header() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const updateUser = () => {
            const storedUser = localStorage.getItem('user')
            try {
                setUser(storedUser ? JSON.parse(storedUser) : null)
            }catch {
                setUser(null)
            }
        }

        window.addEventListener('storage', updateUser)

        updateUser()

        return() => window.removeEventListener('storage', updateUser)
    }, [])

    return(
        <nav className="nav">
            <Link to='/'>Главная</Link>

            {user ? (
                <Link to='/profile'>Профиль</Link>
            ) : (
                <Link to='/register'>Регистрация</Link>
            )}
        </nav>
    )
}