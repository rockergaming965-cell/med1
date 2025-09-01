import { useState } from 'react'
import { Search, FileText, Plus, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import useInventoryStore from '../store/inventoryStore'
import StatCard from '../components/StatCard'

// Mock prescriptions data
const mockPrescriptions = [
  {
    id: 'RX001',
    patientId: 'P001',
    patientName: 'Kanishk',
    doctorName: 'Dr. Keshav',
    date: '2024-01-23',
    status: 'active',
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take with food' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days', instructions: 'Take before meals' }
    ],
    diagnosis: 'Hypertension, Type 2 Diabetes',
    notes: 'Monitor blood pressure and glucose levels regularly',
    interactions: []
  },
  {
    id: 'RX002',
    patientId: 'P002',
    patientName: 'Kanan',
    doctorName: 'Dr. Keshav',
    date: '2024-01-22',
    status: 'active',
    medications: [
      { name: 'Albuterol', dosage: '90mcg', frequency: 'As needed', duration: '15 days', instructions: 'Use inhaler for breathing difficulty' },
      { name: 'Prednisone', dosage: '20mg', frequency: 'Once daily', duration: '7 days', instructions: 'Take with food, taper dose' }
    ],
    diagnosis: 'Acute Asthma Exacerbation',
    notes: 'Emergency prescription - monitor respiratory status',
    interactions: []
  },
  {
    id: 'RX003',
    patientId: 'P003',
    patientName: 'Keshav',
    doctorName: 'Dr. Manik',
    date: '2024-01-21',
    status: 'completed',
    medications: [
      { name: 'Atorvastatin', dosage: '40mg', frequency: 'Once daily', duration: '90 days', instructions: 'Take at bedtime' },
      { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', duration: '90 days', instructions: 'Take with food' }
    ],
    diagnosis: 'Coronary Artery Disease, High Cholesterol',
    notes: 'Continue current regimen, follow up in 3 months',
    interactions: []
  }
]

const Prescriptions = () => {
  const [prescriptions] = useState(mockPrescriptions)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [drugInteractions, setDrugInteractions] = useState([])
  const { checkDrugInteractions } = useInventoryStore()

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prescription.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prescription.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prescription.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'default'
      case 'completed': return 'secondary'
      case 'pending': return 'outline'
      case 'cancelled': return 'destructive'
      default: return 'secondary'
    }
  }

  const handlePrescriptionSelect = (prescription) => {
    setSelectedPrescription(prescription)
    // Check for drug interactions
    const interactions = checkDrugInteractions(prescription.medications)
    setDrugInteractions(interactions)
  }

  // Calculate stats
  const totalPrescriptions = prescriptions.length
  const activePrescriptions = prescriptions.filter(p => p.status === 'active').length
  const completedPrescriptions = prescriptions.filter(p => p.status === 'completed').length
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'pending').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prescription Management</h1>
          <p className="text-muted-foreground">Manage patient prescriptions and medications</p>
        </div>
        <Button className="medical-button">
          <Plus className="w-4 h-4 mr-2" />
          New Prescription
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Prescriptions"
          value={totalPrescriptions}
          icon={FileText}
          variant="default"
        />
        <StatCard
          title="Active"
          value={activePrescriptions}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Completed"
          value={completedPrescriptions}
          icon={CheckCircle}
          variant="default"
        />
        <StatCard
          title="Pending"
          value={pendingPrescriptions}
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* Search */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Search Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by patient name, doctor, prescription ID, or diagnosis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.map((prescription) => (
          <Card key={prescription.id} className="medical-card hover:shadow-[var(--shadow-medical)] transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Prescription {prescription.id}</CardTitle>
                  <CardDescription>
                    Patient: {prescription.patientName} | Doctor: {prescription.doctorName}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusVariant(prescription.status)}>
                    {prescription.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{prescription.date}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Diagnosis:</p>
                  <p className="text-sm text-muted-foreground">{prescription.diagnosis}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Medications ({prescription.medications.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {prescription.medications.map((med, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {med.name} {med.dosage}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handlePrescriptionSelect(prescription)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Full Prescription
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">Prescription {selectedPrescription?.id}</DialogTitle>
                      <DialogDescription>
                        Issued on {selectedPrescription?.date} by {selectedPrescription?.doctorName}
                      </DialogDescription>
                    </DialogHeader>
                    
                    {selectedPrescription && (
                      <div className="space-y-6">
                        {/* Drug Interactions Alert */}
                        {drugInteractions.length > 0 && (
                          <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <div className="space-y-2">
                                <p className="font-semibold">Drug Interactions Detected!</p>
                                {drugInteractions.map((interaction, index) => (
                                  <div key={index} className="text-sm">
                                    <p><strong>{interaction.affectedDrugs.join(' + ')}:</strong> {interaction.description}</p>
                                    <p className="text-xs italic">Recommendation: {interaction.recommendation}</p>
                                  </div>
                                ))}
                              </div>
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Patient & Doctor Info */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-semibold">Patient Information</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Name:</strong> {selectedPrescription.patientName}</p>
                              <p><strong>Patient ID:</strong> {selectedPrescription.patientId}</p>
                              <p><strong>Date Issued:</strong> {selectedPrescription.date}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-semibold">Prescribing Doctor</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Doctor:</strong> {selectedPrescription.doctorName}</p>
                              <p><strong>Status:</strong> 
                                <Badge variant={getStatusVariant(selectedPrescription.status)} className="ml-2">
                                  {selectedPrescription.status}
                                </Badge>
                              </p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Diagnosis */}
                        <div className="space-y-2">
                          <h4 className="font-semibold">Diagnosis</h4>
                          <p className="text-sm text-muted-foreground">{selectedPrescription.diagnosis}</p>
                        </div>

                        <Separator />

                        {/* Medications */}
                        <div className="space-y-3">
                          <h4 className="font-semibold">Prescribed Medications</h4>
                          <div className="space-y-3">
                            {selectedPrescription.medications.map((medication, index) => (
                              <Card key={index} className="p-4 bg-muted/30">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <p className="font-medium text-foreground">{medication.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      <strong>Dosage:</strong> {medication.dosage}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      <strong>Frequency:</strong> {medication.frequency}
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">
                                      <strong>Duration:</strong> {medication.duration}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      <strong>Instructions:</strong> {medication.instructions}
                                    </p>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>

                        {selectedPrescription.notes && (
                          <>
                            <Separator />
                            <div className="space-y-2">
                              <h4 className="font-semibold">Additional Notes</h4>
                              <p className="text-sm text-muted-foreground">{selectedPrescription.notes}</p>
                            </div>
                          </>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                          <Button className="medical-button">
                            Print Prescription
                          </Button>
                          <Button variant="outline">
                            Send to Pharmacy
                          </Button>
                          {selectedPrescription.status === 'active' && (
                            <Button variant="outline">
                              Mark as Completed
                            </Button>
                          )}
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

      {filteredPrescriptions.length === 0 && (
        <Card className="medical-card">
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No prescriptions found matching your criteria.</p>
            <Button variant="outline" className="mt-4" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Prescriptions