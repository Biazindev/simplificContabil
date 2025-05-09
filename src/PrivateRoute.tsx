import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export const PrivateRoute = () => {
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated)

    return isAuthenticated ? <Outlet /> : <Navigate to="/" />
}
