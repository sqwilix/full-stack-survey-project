import { Navigate } from "react-router-dom"

export default function AuthRedirect({children}) {
    const user = (() => {
        try {
            const storedUser = localStorage.getItem('user')
            return storedUser ? JSON.parse(storedUser) : null
        }catch {
            return null
        }
    })()

    if(user) {
        return <Navigate to='/profile' replace/>
    }
        
    return children
}