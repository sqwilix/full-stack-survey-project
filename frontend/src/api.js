const API_URL = 'http://localhost:5000/users'

export async function registerUser({name, email, password}) {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, email, password})
    })
    const result = await res.json()

    if(!res.ok) {
        throw new Error(result.message || 'Ошбика регистрации')
    }
    
    return result
}

export async function loginUser({email, password}) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password})
    })

    const result = await res.json()

    if(!res.ok) {
        throw new Error(result.message || 'Ошбика регистрации')
    }

    return result
}