import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Activity, Loader2, User, UserCheck, Shield, Eye, EyeOff } from 'lucide-react'
import useAuthStore from '../store/authStore'
import { toast } from '@/hooks/use-toast'

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedRole, setSelectedRole] = useState('patient')
  const [showPassword, setShowPassword] = useState(false)
  const [hoveredRole, setHoveredRole] = useState(null)
  const { login, isAuthenticated } = useAuthStore()
  const location = useLocation()
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // Role configurations
  const roles = [
    {
      id: 'patient',
      label: 'Patient',
      icon: User,
      color: 'bg-blue-500 hover:bg-blue-600',
      email: 'patient@hospital.com',
      description: 'Access your medical records'
    },
    {
      id: 'doctor',
      label: 'Doctor',
      icon: UserCheck,
      color: 'bg-green-500 hover:bg-green-600',
      email: 'doctor@hospital.com',
      description: 'Manage patient care'
    },
    {
      id: 'staff',
      label: 'Staff',
      icon: UserCheck,
      color: 'bg-orange-500 hover:bg-orange-600',
      email: 'staff@hospital.com',
      description: 'Hospital operations'
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: Shield,
      color: 'bg-purple-500 hover:bg-purple-600',
      email: 'admin@hospital.com',
      description: 'System administration'
    }
  ]

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/dashboard'} replace />
  }

  const handleRoleSelect = (role) => {
    setSelectedRole(role.id)
    setValue('email', role.email)
    setError('')
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    setError('')
    
    try {
      await login(data.email, data.password)
      toast({
        title: "Login successful",
        description: "Welcome to MediLink Hospital Management System",
      })
    } catch (err) {
      setError(err.message)
      toast({
        title: "Login failed",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-lg">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-6 text-center pb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                MediLink
              </CardTitle>
              <CardDescription className="text-slate-600 mt-2 text-base">
                Hospital Management System
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            {/* Role Selection */}
            <div className="mb-8">
              <Label className="text-sm font-semibold text-slate-700 mb-4 block">
                Select Your Role
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((role) => {
                  const IconComponent = role.icon
                  const isSelected = selectedRole === role.id
                  const isHovered = hoveredRole === role.id
                  
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleRoleSelect(role)}
                      onMouseEnter={() => setHoveredRole(role.id)}
                      onMouseLeave={() => setHoveredRole(null)}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all duration-300 group
                        ${isSelected 
                          ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-200/50 scale-105' 
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                        }
                      `}
                    >
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 transition-all duration-300
                        ${isSelected || isHovered ? role.color : 'bg-slate-100'}
                      `}>
                        <IconComponent 
                          className={`w-6 h-6 transition-colors duration-300 ${
                            isSelected || isHovered ? 'text-white' : 'text-slate-500'
                          }`} 
                        />
                      </div>
                      <p className={`
                        text-sm font-medium transition-colors duration-300
                        ${isSelected ? 'text-blue-700' : 'text-slate-700'}
                      `}>
                        {role.label}
                      </p>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
              {selectedRole && (
                <p className="text-xs text-slate-500 mt-2 text-center animate-fade-in">
                  {roles.find(r => r.id === selectedRole)?.description}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className={`
                      pl-4 pr-4 py-3 text-base transition-all duration-300 border-2
                      ${errors.email 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                      }
                      focus:ring-4 focus:ring-opacity-20
                    `}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 animate-fade-in flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    className={`
                      pl-4 pr-12 py-3 text-base transition-all duration-300 border-2
                      ${errors.password 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                      }
                      focus:ring-4 focus:ring-opacity-20
                    `}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 animate-fade-in flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 animate-fade-in">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full py-3 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
                >
                  Forgot password?
                </button>
              </div>
            </form>

            <div className="mt-8 space-y-3 bg-slate-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-slate-700 text-center">Demo Accounts</p>
              <div className="space-y-2 text-xs text-slate-600">
                {roles.map((role) => (
                  <div key={role.id} className="flex justify-between items-center py-1">
                    <span className="font-medium">{role.label}:</span>
                    <span className="font-mono bg-white px-2 py-1 rounded border text-xs">
                      {role.email}
                    </span>
                  </div>
                ))}
                <p className="text-center italic text-slate-500 pt-2 border-t border-slate-200">
                  Password: any password
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default Login