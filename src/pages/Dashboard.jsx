import { useEffect, useState } from 'react'
import { Users, Activity, Bed, Package, AlertTriangle, Calendar } from 'lucide-react'
import StatCard from '../components/StatCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import usePatientStore from '../store/patientStore'
import useSurgeryStore from '../store/surgeryStore'
import useInventoryStore from '../store/inventoryStore'
import useAuthStore from '../store/authStore'
import PatientDashboard from '../components/PatientDashboard'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'


const patientDistribution = [
  { name: 'Stable', value: 45, color: '#10b981' },
  { name: 'Moderate', value: 25, color: '#f59e0b' },
  { name: 'Critical', value: 15, color: '#ef4444' },
  { name: 'Recovery', value: 15, color: '#3b82f6' },
]

const Dashboard = () => {
  const { user } = useAuthStore()
  
  // Show patient-specific dashboard for patient role
  if (user?.role === 'patient') {
    return <PatientDashboard />
  }
  
  const { patients } = usePatientStore()
  const { surgeries, getSurgeriesToday } = useSurgeryStore()
  const { inventory, lowStockAlerts, expiryAlerts } = useInventoryStore()
  
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Calculate statistics
  const totalPatients = patients.length
  const criticalPatients = patients.filter(p => p.severity === 'high').length
  const todaySurgeries = getSurgeriesToday()
  const totalAlerts = lowStockAlerts.length + expiryAlerts.length
  const availableBeds = 150 - patients.length // Mock calculation

  const upcomingSurgeries = surgeries
    .filter(s => s.status === 'scheduled')
    .slice(0, 5)

  const recentPatients = patients
    .sort((a, b) => new Date(b.admissionDate) - new Date(a.admissionDate))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening at the hospital today
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={totalPatients}
          subtitle="Active admissions"
          icon={Users}
          trend="up"
          trendValue="+5 from yesterday"
          variant="default"
        />
        
        <StatCard
          title="Critical Patients"
          value={criticalPatients}
          subtitle="Require immediate attention"
          icon={AlertTriangle}
          trend="down"
          trendValue="-2 from yesterday"
          variant="emergency"
        />
        
        <StatCard
          title="Today's Surgeries"
          value={todaySurgeries.length}
          subtitle="Scheduled procedures"
          icon={Activity}
          trend="stable"
          trendValue="On schedule"
          variant="success"
        />
        
        <StatCard
          title="Inventory Alerts"
          value={totalAlerts}
          subtitle="Low stock & expiry warnings"
          icon={Package}
          trend="up"
          trendValue="+3 new alerts"
          variant="warning"
        />
      </div>

      {/* Charts and Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Patient Distribution */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span>Patient Distribution</span>
            </CardTitle>
            <CardDescription>
              Current patient status breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={patientDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {patientDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {patientDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Surgeries */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Upcoming Surgeries</span>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSurgeries.map((surgery) => (
                <div key={surgery.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-foreground">{surgery.patientName}</p>
                    <p className="text-sm text-muted-foreground">{surgery.surgeryType}</p>
                    <p className="text-xs text-muted-foreground">
                      {surgery.scheduledDate} at {surgery.scheduledTime}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      surgery.priority === 'urgent' ? 'destructive' :
                      surgery.priority === 'high' ? 'destructive' :
                      surgery.priority === 'medium' ? 'default' : 'secondary'
                    }
                  >
                    {surgery.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Admissions */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span>Recent Admissions</span>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-foreground">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">{patient.ward}</p>
                    <p className="text-xs text-muted-foreground">
                      Admitted: {new Date(patient.admissionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      patient.severity === 'high' ? 'destructive' :
                      patient.severity === 'medium' ? 'default' : 'secondary'
                    }
                  >
                    {patient.currentCondition}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard