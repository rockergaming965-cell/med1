import { useState, useEffect } from 'react'
import { Activity, Heart, Thermometer, Droplets, Wind, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import usePatientStore from '../store/patientStore'
import StatCard from '../components/StatCard'

// Mock real-time vital signs data
const generateVitalSigns = () => ({
  heartRate: Math.floor(Math.random() * 40) + 60, // 60-100
  bloodPressureSystolic: Math.floor(Math.random() * 40) + 110, // 110-150
  bloodPressureDiastolic: Math.floor(Math.random() * 20) + 70, // 70-90
  temperature: (Math.random() * 4 + 96.5).toFixed(1), // 96.5-100.5
  oxygenSaturation: Math.floor(Math.random() * 10) + 90, // 90-100
  respiratoryRate: Math.floor(Math.random() * 10) + 12, // 12-22
})

const Monitoring = () => {
  const { patients, updatePatientVitals } = usePatientStore()
  const [monitoringData, setMonitoringData] = useState({})
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [vitalHistory, setVitalHistory] = useState([])

  // Filter patients that need monitoring (critical and moderate cases)
  const monitoredPatients = patients.filter(p => p.severity === 'high' || p.severity === 'medium')

  useEffect(() => {
    // Simulate real-time vital signs updates
    const interval = setInterval(() => {
      const newData = {}
      monitoredPatients.forEach(patient => {
        const vitals = generateVitalSigns()
        newData[patient.id] = vitals
        updatePatientVitals(patient.id, vitals)
      })
      setMonitoringData(newData)

      // Update history for selected patient
      if (selectedPatient) {
        const newVitals = newData[selectedPatient.id]
        if (newVitals) {
          setVitalHistory(prev => {
            const newHistory = [...prev, {
              time: new Date().toLocaleTimeString(),
              ...newVitals
            }]
            return newHistory.slice(-20) // Keep last 20 readings
          })
        }
      }
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [monitoredPatients, selectedPatient, updatePatientVitals])

  const getVitalStatus = (vital, type) => {
    switch (type) {
      case 'heartRate':
        if (vital < 60 || vital > 100) return 'critical'
        if (vital < 70 || vital > 90) return 'warning'
        return 'normal'
      case 'oxygenSaturation':
        if (vital < 95) return 'critical'
        if (vital < 98) return 'warning'
        return 'normal'
      case 'temperature':
        const temp = parseFloat(vital)
        if (temp < 96 || temp > 100.4) return 'critical'
        if (temp < 97 || temp > 99.5) return 'warning'
        return 'normal'
      case 'respiratoryRate':
        if (vital < 12 || vital > 20) return 'warning'
        return 'normal'
      default:
        return 'normal'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-destructive'
      case 'warning': return 'text-warning'
      case 'normal': return 'text-success'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'critical': return 'destructive'
      case 'warning': return 'secondary'
      case 'normal': return 'default'
      default: return 'outline'
    }
  }

  // Calculate monitoring stats
  const totalMonitored = monitoredPatients.length
  const criticalAlerts = Object.values(monitoringData).filter(vitals => 
    getVitalStatus(vitals.heartRate, 'heartRate') === 'critical' ||
    getVitalStatus(vitals.oxygenSaturation, 'oxygenSaturation') === 'critical' ||
    getVitalStatus(vitals.temperature, 'temperature') === 'critical'
  ).length
  const warningAlerts = Object.values(monitoringData).filter(vitals => 
    getVitalStatus(vitals.heartRate, 'heartRate') === 'warning' ||
    getVitalStatus(vitals.oxygenSaturation, 'oxygenSaturation') === 'warning' ||
    getVitalStatus(vitals.temperature, 'temperature') === 'warning'
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Real-time Patient Monitoring</h1>
          <p className="text-muted-foreground">Monitor vital signs and patient status in real-time</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live monitoring active</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Patients Monitored"
          value={totalMonitored}
          icon={Activity}
          variant="default"
        />
        <StatCard
          title="Critical Alerts"
          value={criticalAlerts}
          icon={AlertTriangle}
          variant="emergency"
        />
        <StatCard
          title="Warning Alerts"
          value={warningAlerts}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="System Status"
          value="Online"
          subtitle="All monitors active"
          icon={Activity}
          variant="success"
        />
      </div>

      {/* Patient Monitoring Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {monitoredPatients.map((patient) => {
          const vitals = monitoringData[patient.id] || patient.vitals
          const heartRateStatus = getVitalStatus(vitals.heartRate, 'heartRate')
          const oxygenStatus = getVitalStatus(vitals.oxygenSaturation, 'oxygenSaturation')
          const tempStatus = getVitalStatus(vitals.temperature, 'temperature')
          const respStatus = getVitalStatus(vitals.respiratoryRate, 'respiratoryRate')

          const overallStatus = [heartRateStatus, oxygenStatus, tempStatus, respStatus].includes('critical') 
            ? 'critical' 
            : [heartRateStatus, oxygenStatus, tempStatus, respStatus].includes('warning')
            ? 'warning'
            : 'normal'

          return (
            <Card 
              key={patient.id} 
              className={`
                medical-card cursor-pointer transition-all duration-300
                ${overallStatus === 'critical' ? 'border-destructive/50 bg-destructive/5' : 
                  overallStatus === 'warning' ? 'border-warning/50 bg-warning/5' : 
                  'hover:shadow-[var(--shadow-medical)]'}
              `}
              onClick={() => setSelectedPatient(patient.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <CardDescription>
                      {patient.ward} | ID: {patient.id}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusVariant(overallStatus)}>
                    {overallStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Heart className={`w-4 h-4 ${getStatusColor(heartRateStatus)}`} />
                        <span className="text-sm">Heart Rate</span>
                      </div>
                      <span className={`font-medium ${getStatusColor(heartRateStatus)}`}>
                        {vitals.heartRate} bpm
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Droplets className={`w-4 h-4 ${getStatusColor(oxygenStatus)}`} />
                        <span className="text-sm">O2 Sat</span>
                      </div>
                      <span className={`font-medium ${getStatusColor(oxygenStatus)}`}>
                        {vitals.oxygenSaturation}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Thermometer className={`w-4 h-4 ${getStatusColor(tempStatus)}`} />
                        <span className="text-sm">Temp</span>
                      </div>
                      <span className={`font-medium ${getStatusColor(tempStatus)}`}>
                        {vitals.temperature}°F
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Wind className={`w-4 h-4 ${getStatusColor(respStatus)}`} />
                        <span className="text-sm">Resp Rate</span>
                      </div>
                      <span className={`font-medium ${getStatusColor(respStatus)}`}>
                        {vitals.respiratoryRate}/min
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Blood Pressure</span>
                    <span className="font-medium">
                      {vitals.bloodPressureSystolic || vitals.bloodPressure}/{vitals.bloodPressureDiastolic || '80'} mmHg
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detailed Patient Monitor */}
      {selectedPatient && (
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <span>Detailed Monitor - {patients.find(p => p.id === selectedPatient)?.name}</span>
            </CardTitle>
            <CardDescription>Real-time vital signs tracking</CardDescription>
          </CardHeader>
          <CardContent>
            {vitalHistory.length > 0 && (
              <div className="space-y-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={vitalHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="heartRate" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        name="Heart Rate (bpm)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="oxygenSaturation" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="O2 Saturation (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Showing last {vitalHistory.length} readings (updates every 3 seconds)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {monitoredPatients.length === 0 && (
        <Card className="medical-card">
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No patients currently require real-time monitoring.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Monitoring