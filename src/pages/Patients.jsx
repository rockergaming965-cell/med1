import { useState } from 'react'
import { Search, Filter, UserPlus, Eye, Heart, Thermometer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import usePatientStore from '../store/patientStore'
import StatCard from '../components/StatCard'

const Patients = () => {
  const { 
    patients, 
    searchQuery, 
    filterSeverity, 
    setSearchQuery, 
    setFilterSeverity, 
    getFilteredPatients,
    generateAISummary 
  } = usePatientStore()

  const [selectedPatient, setSelectedPatient] = useState(null)
  const [aiSummary, setAISummary] = useState('')

  const filteredPatients = getFilteredPatients()

  const getSeverityVariant = (severity) => {
    switch (severity) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient)
    setAISummary(generateAISummary(patient.id))
  }

  // Calculate stats
  const totalPatients = patients.length
  const criticalPatients = patients.filter(p => p.severity === 'high').length
  const stablePatients = patients.filter(p => p.severity === 'low').length
  const averageAge = Math.round(patients.reduce((sum, p) => sum + p.age, 0) / patients.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patient Management</h1>
          <p className="text-muted-foreground">Manage and monitor patient records</p>
        </div>
        <Button className="medical-button">
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Patient
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={totalPatients}
          icon={UserPlus}
          variant="default"
        />
        <StatCard
          title="Critical Cases"
          value={criticalPatients}
          icon={Heart}
          variant="emergency"
        />
        <StatCard
          title="Stable Patients"
          value={stablePatients}
          icon={Thermometer}
          variant="success"
        />
        <StatCard
          title="Average Age"
          value={`${averageAge} years`}
          subtitle="Current cohort"
          variant="default"
        />
      </div>

      {/* Search and Filters */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Search & Filter Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name or patient ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="high">Critical</SelectItem>
                <SelectItem value="medium">Moderate</SelectItem>
                <SelectItem value="low">Stable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="medical-card hover:shadow-[var(--shadow-medical)] transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{patient.name}</CardTitle>
                  <CardDescription>ID: {patient.id}</CardDescription>
                </div>
                <Badge variant={getSeverityVariant(patient.severity)}>
                  {patient.currentCondition}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Age:</span>
                  <span className="font-medium">{patient.age} years</span>
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="font-medium">{patient.gender}</span>
                  <span className="text-muted-foreground">Blood Group:</span>
                  <span className="font-medium">{patient.bloodGroup}</span>
                  <span className="text-muted-foreground">Ward:</span>
                  <span className="font-medium text-xs">{patient.ward}</span>
                </div>

                <div className="border-t pt-3">
                  <p className="text-sm text-muted-foreground mb-2">Current Vitals:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3 h-3 text-primary" />
                      <span>{patient.vitals.heartRate} bpm</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Thermometer className="w-3 h-3 text-warning" />
                      <span>{patient.vitals.temperature}°F</span>
                    </div>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{selectedPatient?.name}</DialogTitle>
                      <DialogDescription>Patient ID: {selectedPatient?.id}</DialogDescription>
                    </DialogHeader>
                    
                    {selectedPatient && (
                      <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="vitals">Vitals</TabsTrigger>
                          <TabsTrigger value="medications">Medications</TabsTrigger>
                          <TabsTrigger value="ai-summary">AI Summary</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="overview" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h4 className="font-semibold">Personal Information</h4>
                              <div className="space-y-1 text-sm">
                                <p><strong>Age:</strong> {selectedPatient.age} years</p>
                                <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                                <p><strong>Blood Group:</strong> {selectedPatient.bloodGroup}</p>
                                <p><strong>Phone:</strong> {selectedPatient.phone}</p>
                                <p><strong>Email:</strong> {selectedPatient.email}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-semibold">Medical Information</h4>
                              <div className="space-y-1 text-sm">
                                <p><strong>Condition:</strong> {selectedPatient.currentCondition}</p>
                                <p><strong>Ward:</strong> {selectedPatient.ward}</p>
                                <p><strong>Doctor:</strong> {selectedPatient.assignedDoctor}</p>
                                <p><strong>Admitted:</strong> {new Date(selectedPatient.admissionDate).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-semibold">Medical History</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedPatient.medicalHistory.map((condition, index) => (
                                <Badge key={index} variant="secondary">{condition}</Badge>
                              ))}
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="vitals" className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <StatCard
                              title="Heart Rate"
                              value={`${selectedPatient.vitals.heartRate} bpm`}
                              icon={Heart}
                              variant="default"
                            />
                            <StatCard
                              title="Blood Pressure"
                              value={selectedPatient.vitals.bloodPressure}
                              subtitle="mmHg"
                              variant="default"
                            />
                            <StatCard
                              title="Temperature"
                              value={`${selectedPatient.vitals.temperature}°F`}
                              icon={Thermometer}
                              variant="default"
                            />
                            <StatCard
                              title="Oxygen Saturation"
                              value={`${selectedPatient.vitals.oxygenSaturation}%`}
                              variant="success"
                            />
                            <StatCard
                              title="Respiratory Rate"
                              value={`${selectedPatient.vitals.respiratoryRate}/min`}
                              variant="default"
                            />
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="medications" className="space-y-4">
                          <div className="space-y-3">
                            {selectedPatient.medications.map((med, index) => (
                              <Card key={index} className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-semibold">{med.name}</h5>
                                    <p className="text-sm text-muted-foreground">
                                      {med.dosage} - {med.frequency}
                                    </p>
                                  </div>
                                  <Badge variant="outline">Active</Badge>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="ai-summary" className="space-y-4">
                          <Card className="medical-card">
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                  <span className="text-xs text-primary-foreground font-bold">AI</span>
                                </div>
                                <span>AI-Generated Patient Summary</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm leading-relaxed text-foreground">
                                {aiSummary}
                              </p>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card className="medical-card">
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No patients found matching your criteria.</p>
            <Button variant="outline" className="mt-4" onClick={() => {
              setSearchQuery('')
              setFilterSeverity('all')
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Patients