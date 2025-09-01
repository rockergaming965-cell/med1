import { useState, useEffect } from 'react'
import { AlertTriangle, Phone, MapPin, Clock, Users, Activity, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import StatCard from '../components/StatCard'

// Mock emergency cases data
const mockEmergencyCases = [
  {
    id: 'EM001',
    patientName: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    chiefComplaint: 'Chest pain and shortness of breath',
    triageLevel: 1, // 1=Critical, 2=Urgent, 3=Less Urgent, 4=Non-urgent
    arrivalTime: '14:30',
    arrivalDate: '2024-01-23',
    status: 'in-treatment',
    assignedDoctor: 'Dr. Manik',
    assignedNurse: 'Nurse Priya',
    vitals: {
      heartRate: 110,
      bloodPressure: '160/95',
      temperature: 98.8,
      oxygenSaturation: 92,
      respiratoryRate: 24
    },
    symptoms: ['Chest pain', 'Shortness of breath', 'Sweating', 'Nausea'],
    initialAssessment: 'Possible myocardial infarction',
    treatmentPlan: 'ECG, Cardiac enzymes, Oxygen therapy',
    location: 'Emergency Bay 1'
  },
  {
    id: 'EM002',
    patientName: 'Priya Sharma',
    age: 28,
    gender: 'Female',
    chiefComplaint: 'Severe abdominal pain',
    triageLevel: 2,
    arrivalTime: '15:15',
    arrivalDate: '2024-01-23',
    status: 'waiting',
    assignedDoctor: 'Dr. Vedant',
    assignedNurse: 'Nurse Kavya',
    vitals: {
      heartRate: 95,
      bloodPressure: '125/80',
      temperature: 101.2,
      oxygenSaturation: 98,
      respiratoryRate: 18
    },
    symptoms: ['Severe abdominal pain', 'Fever', 'Vomiting'],
    initialAssessment: 'Possible appendicitis',
    treatmentPlan: 'CT scan, Blood work, Pain management',
    location: 'Emergency Bay 3'
  },
  {
    id: 'EM003',
    patientName: 'Amit Patel',
    age: 35,
    gender: 'Male',
    chiefComplaint: 'Motor vehicle accident',
    triageLevel: 1,
    arrivalTime: '16:00',
    arrivalDate: '2024-01-23',
    status: 'critical',
    assignedDoctor: 'Dr. Kanishk',
    assignedNurse: 'Nurse Ravi',
    vitals: {
      heartRate: 125,
      bloodPressure: '90/60',
      temperature: 97.5,
      oxygenSaturation: 89,
      respiratoryRate: 28
    },
    symptoms: ['Multiple trauma', 'Head injury', 'Possible internal bleeding'],
    initialAssessment: 'Polytrauma with possible internal injuries',
    treatmentPlan: 'Trauma protocol, CT scan, Surgery consult',
    location: 'Trauma Bay 1'
  }
]

const Emergency = () => {
  const [emergencyCases] = useState(mockEmergencyCases)
  const [selectedCase, setSelectedCase] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getTriageLevelVariant = (level) => {
    switch (level) {
      case 1: return 'destructive' // Critical
      case 2: return 'secondary'  // Urgent
      case 3: return 'default'    // Less Urgent
      case 4: return 'outline'    // Non-urgent
      default: return 'outline'
    }
  }

  const getTriageLevelColor = (level) => {
    switch (level) {
      case 1: return 'text-destructive'
      case 2: return 'text-warning'
      case 3: return 'text-primary'
      case 4: return 'text-muted-foreground'
      default: return 'text-muted-foreground'
    }
  }

  const getTriageLevelText = (level) => {
    switch (level) {
      case 1: return 'Critical'
      case 2: return 'Urgent'
      case 3: return 'Less Urgent'
      case 4: return 'Non-urgent'
      default: return 'Unknown'
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'critical': return 'destructive'
      case 'in-treatment': return 'default'
      case 'waiting': return 'secondary'
      case 'discharged': return 'outline'
      default: return 'secondary'
    }
  }

  const getWaitTime = (arrivalTime, arrivalDate) => {
    const arrival = new Date(`${arrivalDate} ${arrivalTime}`)
    const now = currentTime
    const diffMs = now - arrival
    const diffMins = Math.floor(diffMs / (1000 * 60))
    
    if (diffMins < 60) return `${diffMins}m`
    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    return `${hours}h ${mins}m`
  }

  // Calculate stats
  const totalCases = emergencyCases.length
  const criticalCases = emergencyCases.filter(c => c.triageLevel === 1).length
  const urgentCases = emergencyCases.filter(c => c.triageLevel === 2).length
  const inTreatment = emergencyCases.filter(c => c.status === 'in-treatment' || c.status === 'critical').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Emergency Department</h1>
          <p className="text-muted-foreground">Manage emergency cases and triage</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Phone className="w-4 h-4 mr-2" />
            Call Ambulance
          </Button>
          <Button className="emergency-button">
            <Zap className="w-4 h-4 mr-2" />
            New Emergency
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalCases > 0 && (
        <Alert variant="destructive" className="animate-pulse">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{criticalCases} critical cases</strong> require immediate attention!
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Cases"
          value={totalCases}
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Critical Cases"
          value={criticalCases}
          icon={AlertTriangle}
          variant="emergency"
        />
        <StatCard
          title="Urgent Cases"
          value={urgentCases}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="In Treatment"
          value={inTreatment}
          icon={Activity}
          variant="default"
        />
      </div>

      {/* Emergency Cases */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Emergency Cases</h2>
        
        {emergencyCases
          .sort((a, b) => a.triageLevel - b.triageLevel) // Sort by triage priority
          .map((emergencyCase) => (
          <Card 
            key={emergencyCase.id} 
            className={`
              medical-card transition-all duration-300
              ${emergencyCase.triageLevel === 1 ? 'border-destructive/50 bg-destructive/5' : 
                emergencyCase.triageLevel === 2 ? 'border-warning/50 bg-warning/5' : 
                'hover:shadow-[var(--shadow-medical)]'}
            `}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{emergencyCase.patientName}</CardTitle>
                  <CardDescription>
                    {emergencyCase.age}yo {emergencyCase.gender} | Case ID: {emergencyCase.id}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getTriageLevelVariant(emergencyCase.triageLevel)}>
                    Triage {emergencyCase.triageLevel}
                  </Badge>
                  <Badge variant={getStatusVariant(emergencyCase.status)}>
                    {emergencyCase.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Arrival:</span>
                    <p className="font-medium">{emergencyCase.arrivalTime}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Wait Time:</span>
                    <p className="font-medium">{getWaitTime(emergencyCase.arrivalTime, emergencyCase.arrivalDate)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <p className="font-medium">{emergencyCase.location}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Priority:</span>
                    <p className={`font-medium ${getTriageLevelColor(emergencyCase.triageLevel)}`}>
                      {getTriageLevelText(emergencyCase.triageLevel)}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground">Chief Complaint:</span>
                  <p className="font-medium">{emergencyCase.chiefComplaint}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Assigned Doctor:</span>
                    <p className="font-medium">{emergencyCase.assignedDoctor}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Assigned Nurse:</span>
                    <p className="font-medium">{emergencyCase.assignedNurse}</p>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setSelectedCase(emergencyCase)}
                    >
                      View Full Case Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl flex items-center space-x-2">
                        <AlertTriangle className={`w-6 h-6 ${getTriageLevelColor(selectedCase?.triageLevel)}`} />
                        <span>Emergency Case {selectedCase?.id}</span>
                      </DialogTitle>
                      <DialogDescription>
                        {selectedCase?.patientName} - {getTriageLevelText(selectedCase?.triageLevel)} Priority
                      </DialogDescription>
                    </DialogHeader>
                    
                    {selectedCase && (
                      <div className="space-y-6">
                        {/* Patient Info */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-semibold">Patient Information</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Name:</strong> {selectedCase.patientName}</p>
                              <p><strong>Age:</strong> {selectedCase.age} years</p>
                              <p><strong>Gender:</strong> {selectedCase.gender}</p>
                              <p><strong>Arrival:</strong> {selectedCase.arrivalDate} at {selectedCase.arrivalTime}</p>
                              <p><strong>Wait Time:</strong> {getWaitTime(selectedCase.arrivalTime, selectedCase.arrivalDate)}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-semibold">Case Details</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Triage Level:</strong> 
                                <Badge variant={getTriageLevelVariant(selectedCase.triageLevel)} className="ml-2">
                                  {getTriageLevelText(selectedCase.triageLevel)}
                                </Badge>
                              </p>
                              <p><strong>Status:</strong> 
                                <Badge variant={getStatusVariant(selectedCase.status)} className="ml-2">
                                  {selectedCase.status.replace('-', ' ')}
                                </Badge>
                              </p>
                              <p><strong>Location:</strong> {selectedCase.location}</p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Medical Assessment */}
                        <div className="space-y-4">
                          <h4 className="font-semibold">Medical Assessment</h4>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium">Chief Complaint:</p>
                              <p className="text-sm text-muted-foreground">{selectedCase.chiefComplaint}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Initial Assessment:</p>
                              <p className="text-sm text-muted-foreground">{selectedCase.initialAssessment}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Treatment Plan:</p>
                              <p className="text-sm text-muted-foreground">{selectedCase.treatmentPlan}</p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Symptoms */}
                        <div className="space-y-2">
                          <h4 className="font-semibold">Presenting Symptoms</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedCase.symptoms.map((symptom, index) => (
                              <Badge key={index} variant="outline">{symptom}</Badge>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Current Vitals */}
                        <div className="space-y-3">
                          <h4 className="font-semibold">Current Vital Signs</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Activity className="w-4 h-4 text-primary" />
                                <span className="text-sm">Heart Rate</span>
                              </div>
                              <span className="font-medium">{selectedCase.vitals.heartRate} bpm</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <span className="text-sm">Blood Pressure</span>
                              <span className="font-medium">{selectedCase.vitals.bloodPressure} mmHg</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <span className="text-sm">Temperature</span>
                              <span className="font-medium">{selectedCase.vitals.temperature}°F</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <span className="text-sm">O2 Saturation</span>
                              <span className="font-medium">{selectedCase.vitals.oxygenSaturation}%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <span className="text-sm">Respiratory Rate</span>
                              <span className="font-medium">{selectedCase.vitals.respiratoryRate}/min</span>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Staff Assignment */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-semibold">Assigned Staff</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Doctor:</strong> {selectedCase.assignedDoctor}</p>
                              <p><strong>Nurse:</strong> {selectedCase.assignedNurse}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-semibold">Location</h4>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{selectedCase.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                          {selectedCase.status === 'waiting' && (
                            <Button className="medical-button">
                              Start Treatment
                            </Button>
                          )}
                          {selectedCase.status === 'in-treatment' && (
                            <Button variant="outline" className="border-success text-success hover:bg-success hover:text-success-foreground">
                              Complete Treatment
                            </Button>
                          )}
                          <Button variant="outline">
                            Update Status
                          </Button>
                          <Button variant="outline">
                            Transfer to Ward
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {emergencyCases.length === 0 && (
        <Card className="medical-card">
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">No Active Emergency Cases</p>
                <p className="text-muted-foreground">All emergency cases have been resolved.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Emergency