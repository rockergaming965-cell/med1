import { useState, useEffect } from 'react'
import { Calendar, FileText, Heart, Clock, User, Phone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StatCard from './StatCard'
import useAuthStore from '../store/authStore'
import usePatientStore from '../store/patientStore'

const PatientDashboard = () => {
  const { user } = useAuthStore()
  const { patients } = usePatientStore()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Find current patient data (in real app, this would be based on user ID)
  const patientData = patients.find(p => p.name.toLowerCase().includes(user?.name?.toLowerCase().split(' ')[0] || '')) || patients[0]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Mock upcoming appointments
  const upcomingAppointments = [
    {
      id: 'A001',
      date: '2024-01-25',
      time: '10:00 AM',
      doctor: 'Dr. Keshav',
      department: 'Cardiology',
      type: 'Follow-up'
    },
    {
      id: 'A002',
      date: '2024-01-30',
      time: '2:00 PM',
      doctor: 'Dr. Manik',
      department: 'General Medicine',
      type: 'Routine Check-up'
    }
  ]

  // Mock test results
  const recentTestResults = [
    {
      id: 'T001',
      test: 'Blood Glucose',
      value: '145 mg/dL',
      date: '2024-01-20',
      status: 'normal',
      reference: '70-140 mg/dL'
    },
    {
      id: 'T002',
      test: 'Blood Pressure',
      value: '120/80 mmHg',
      date: '2024-01-20',
      status: 'normal',
      reference: '<120/80 mmHg'
    },
    {
      id: 'T003',
      test: 'Cholesterol',
      value: '180 mg/dL',
      date: '2024-01-18',
      status: 'borderline',
      reference: '<200 mg/dL'
    }
  ]

  const getTestStatusVariant = (status) => {
    switch (status) {
      case 'normal': return 'default'
      case 'borderline': return 'secondary'
      case 'abnormal': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome, {user?.name}
          </h1>
          <p className="text-muted-foreground">
            Your personal health dashboard
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-foreground">
            {currentTime.toLocaleTimeString()}
          </p>
          <p className="text-sm text-muted-foreground">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Next Appointment"
          value="Jan 25"
          subtitle="10:00 AM with Dr. Keshav"
          icon={Calendar}
          variant="default"
        />
        <StatCard
          title="Current Condition"
          value={patientData?.currentCondition || 'Stable'}
          icon={Heart}
          variant="success"
        />
        <StatCard
          title="Medications"
          value={patientData?.medications?.length || 0}
          subtitle="Active prescriptions"
          icon={FileText}
          variant="default"
        />
        <StatCard
          title="Last Visit"
          value="Jan 20"
          subtitle="Cardiology follow-up"
          icon={Clock}
          variant="default"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patientData && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Patient ID:</span>
                    <p className="font-medium">{patientData.id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Age:</span>
                    <p className="font-medium">{patientData.age} years</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Blood Group:</span>
                    <p className="font-medium">{patientData.bloodGroup}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Gender:</span>
                    <p className="font-medium">{patientData.gender}</p>
                  </div>
                </div>
                
                <div className="pt-3 border-t">
                  <span className="text-sm text-muted-foreground">Contact Information:</span>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{patientData.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{patientData.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Vitals */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-primary" />
              <span>Current Vitals</span>
            </CardTitle>
            <CardDescription>Latest recorded measurements</CardDescription>
          </CardHeader>
          <CardContent>
            {patientData && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Heart Rate:</span>
                    <span className="font-medium">{patientData.vitals.heartRate} bpm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Blood Pressure:</span>
                    <span className="font-medium">{patientData.vitals.bloodPressure} mmHg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Temperature:</span>
                    <span className="font-medium">{patientData.vitals.temperature}°F</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">O2 Saturation:</span>
                    <span className="font-medium">{patientData.vitals.oxygenSaturation}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Respiratory Rate:</span>
                    <span className="font-medium">{patientData.vitals.respiratoryRate}/min</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Appointments and Test Results */}
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="tests">Test Results</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments" className="space-y-4">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{appointment.doctor}</p>
                      <p className="text-sm text-muted-foreground">{appointment.department}</p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.date} at {appointment.time}
                      </p>
                    </div>
                    <Badge variant="outline">{appointment.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tests" className="space-y-4">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Recent Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTestResults.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{test.test}</p>
                      <p className="text-sm text-muted-foreground">Reference: {test.reference}</p>
                      <p className="text-xs text-muted-foreground">Date: {test.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{test.value}</p>
                      <Badge variant={getTestStatusVariant(test.status)}>
                        {test.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="medications" className="space-y-4">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Current Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {patientData?.medications?.map((medication, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{medication.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {medication.dosage} - {medication.frequency}
                      </p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PatientDashboard