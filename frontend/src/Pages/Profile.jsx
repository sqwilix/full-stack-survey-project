import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Profile() {
    const [user, setUser] = useState(null)
    const [form, setForm] = useState({name: '', email: '', avatar: null})
    const [message, setMessage] = useState('')
    const [showFrom, setShowForm] = useState(false)
    const navigate = useNavigate()
    
    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if(savedUser) {
            const parsed = JSON.parse(savedUser)
            setUser(parsed)
            setForm({name: parsed.name, email: parsed.email})
        }
    }, [])

    const handleUpdate = async (e) => {
        e.preventDefault()

        const accessToken = localStorage.getItem('accessToken')
        const formData = new FormData()
        formData.append('name', form.name)
        formData.append('email', form.email)

        if(form.avatar) {
            formData.append('avatar', form.avatar)
        }
        try {

            const res = await fetch('http://localhost:5000/users/update', {
                method: "PUT",
                headers: {"Authorization": `Bearer ${accessToken}`},
                body: formData
            })

            const data = await res.json()
            if(!res.ok) throw new Error(data.message || 'Ошибка при обновлении профиля')
            setUser(data.user)
            localStorage.setItem('user', JSON.stringify(data.user))

            setMessage('Данные успешно обновлены')

            navigate('/profile')
        }catch(err) {
            setMessage(err.message)
        }
    }
    
    const logout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        window.dispatchEvent(new Event('storage'))
        navigate('/')
    }
    
    if(!user) return <h2>Загрузка...</h2>

    return(
        <div className="profile_container">
                <h2>Профиль</h2>
                <h3>{user.name}</h3>
                <img
                    src={
                        user?.avatar
                        ? user.avatar.startsWith('http')
                            ? user.avatar
                            : `http://localhost:5000${user.avatar}`
                        : 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png'
                    }
                    alt="avatar"
                    className="profile_avatar"
                />
                <p>{user.email}</p>

                <button className="edit_profile" onClick={() => setShowForm(!showFrom)}>
                    {showFrom ? 'Отменить' : 'Изменить профиль'}
                </button>
                <br />
                
                {showFrom && (
                    <form onSubmit={handleUpdate}>
                        <label>Имя</label>
                        <input type="text" 
                            value={form.name}
                            onChange={(e) => setForm({...form, name: e.target.value})}
                            placeholder="Новое имя"
                        />
                        <br />

                        <label>Email</label>
                        <input type="email" 
                            value={form.email}
                            onChange={(e) => setForm({...form, email: e.target.value})}
                            placeholder="Новый email"
                        />
                        <br />

                        <label>Аватар</label>
                        <input type="file" onChange={(e) => setForm({...form, avatar: e.target.files[0]})}/>
                        <button className="save_result" type="submit">Сохранить</button>
                    </form>
                )}
                {message && <p>{message}</p>}
                <button className="logout" onClick={logout}>Выйти с аккаунта</button>
        </div>
    )
}