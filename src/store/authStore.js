import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        await new Promise(resolve => setTimeout(resolve, 1000))

        let user = null
        if (email === 'doctor@hospital.com') {
          user = {
            id: '1',
            email,
            name: 'Dr. Keshav',
            role: 'doctor',
            specialty: 'Cardiology',
            avatar: 'https://www.veryicon.com/icons/miscellaneous/two-color-icon-library/user-286.html'
          }
        } else if (email === 'nurse@hospital.com') {
          user = {
            id: '2',
            email,
            name: 'Manik',
            role: 'staff',
            department: 'ICU',
            avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face'
          }
        } else if (email === 'admin@hospital.com') {
          user = {
            id: '3',
            email,
            name: 'Kanishk',
            role: 'admin',
            department: 'Administration',
            avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face'
          }
        } else {
          throw new Error('Invalid credentials')
        }
        
        set({ user, isAuthenticated: true })
        return user
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
      
      // Check if user has required role
      hasRole: (role) => {
        const { user } = get()
        return user?.role === role
      },
      
      // Check if user has any of the required roles
      hasAnyRole: (roles) => {
        const { user } = get()
        return roles.includes(user?.role)
      }
    }),
    {
      name: 'hms-auth'
    }
  )
)

export default useAuthStore