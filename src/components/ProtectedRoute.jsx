import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, hasAnyRole } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    // Redirect to unauthorized page or dashboard
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute