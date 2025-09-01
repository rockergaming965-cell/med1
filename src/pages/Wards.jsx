import { useState } from 'react'
import { Bed, Users, MapPin, Plus, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import StatCard from '../components/StatCard'

// Mock ward data
const mockWards = [
  {
    id: 'W001',
    name: 'ICU',
    department: 'Critical Care',
    floor: 3,
    totalBeds: 20,
    occupiedBeds: 18,
    availableBeds: 2,
    nurseInCharge: 'Nurse Priya',
    patients: [
      { id: 'P002', name: 'Kanan', bed: 'ICU-105', condition: 'Critical', admissionDate: '2024-01-22' },
      { id: 'P008', name: 'Arjun Mehta', bed: 'ICU-107', condition: 'Stable', admissionDate: '2024-01-21' }
    ]
  },
  {
    id: 'W002',
    name: 'Cardiology Ward',
    department: 'Cardiology',
    floor: 2,
    totalBeds: 30,
    occupiedBeds: 25,
    availableBeds: 5,
    nurseInCharge: 'Nurse Kavya',
    patients: [
      { id: 'P001', name: 'Kanishk', bed: 'CARD-301', condition: 'Stable', admissionDate: '2024-01-20' }
    ]
  },
  {
    id: 'W003',
    name: 'General Ward A',
    department: 'General Medicine',
    floor: 1,
    totalBeds: 40,
    occupiedBeds: 32,
    availableBeds: 8,
    nurseInCharge: 'Nurse Ravi',
    patients: [
      { id: 'P003', name: 'Keshav', bed: 'GEN-210', condition: 'Good', admissionDate: '2024-01-18' }
    ]
  },
  {
    id: 'W004',
    name: 'Pediatric Ward',
    department: 'Pediatrics',
    floor: 2,
    totalBeds: 25,
    occupiedBeds: 15,
    availableBeds: 10,
    nurseInCharge: 'Nurse Meera',
    patients: []
  },
  {
    id: 'W005',
    name: 'Maternity Ward',
    department: 'Obstetrics & Gynecology',
    floor: 4,
    totalBeds: 35,
    occupiedBeds: 28,
    availableBeds: 7,
    nurseInCharge: 'Nurse Sunita',
    patients: []
  },
  {
    id: 'W006',
    name: 'Orthopedic Ward',
    department: 'Orthopedics',
    floor: 1,
    totalBeds: 30,
    occupiedBeds: 22,
    availableBeds: 8,
    nurseInCharge: 'Nurse Rajesh',
    patients: []
  }
]

const Wards = () => {
  const [wards] = useState(mockWards)
  const [selectedWard, setSelectedWard] = useState(null)

  const getOccupancyVariant = (percentage) => {
    if (percentage >= 90) return 'destructive'
    if (percentage >= 75) return 'default'
    return 'secondary'
  }

  const getOccupancyPercentage = (occupied, total) => {
    return Math.round((occupied / total) * 100)
  }

  // Calculate stats
  const totalBeds = wards.reduce((sum, ward) => sum + ward.totalBeds, 0)
  const occupiedBeds = wards.reduce((sum, ward) => sum + ward.occupiedBeds, 0)
  const availableBeds = totalBeds - occupiedBeds
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ward Management</h1>
          <p className="text-muted-foreground">Monitor bed allocation and ward capacity</p>
        </div>
        <Button className="medical-button">
          <Plus className="w-4 h-4 mr-2" />
          Add New Ward
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Beds"
          value={totalBeds}
          icon={Bed}
          variant="default"
        />
        <StatCard
          title="Occupied Beds"
          value={occupiedBeds}
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Available Beds"
          value={availableBeds}
          icon={Bed}
          variant="success"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          icon={Activity}
          variant={occupancyRate >= 90 ? "emergency" : occupancyRate >= 75 ? "warning" : "default"}
        />
      </div>

      {/* Wards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wards.map((ward) => {
          const occupancyPercentage = getOccupancyPercentage(ward.occupiedBeds, ward.totalBeds)
          
          return (
            <Card key={ward.id} className="medical-card hover:shadow-[var(--shadow-medical)] transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{ward.name}</CardTitle>
                    <CardDescription>{ward.department}</CardDescription>
                  </div>
                  <Badge variant={getOccupancyVariant(occupancyPercentage)}>
                    {occupancyPercentage}% Full
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Bed Occupancy</span>
                      <span>{ward.occupiedBeds}/{ward.totalBeds}</span>
                    </div>
                    <Progress value={occupancyPercentage} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">Floor:</span>
                    <span className="font-medium">Floor {ward.floor}</span>
                    <span className="text-muted-foreground">Available:</span>
                    <span className="font-medium text-success">{ward.availableBeds} beds</span>
                    <span className="text-muted-foreground">Nurse in Charge:</span>
                    <span className="font-medium text-xs">{ward.nurseInCharge}</span>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setSelectedWard(ward)}
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        View Ward Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">{selectedWard?.name}</DialogTitle>
                        <DialogDescription>{selectedWard?.department} - Floor {selectedWard?.floor}</DialogDescription>
                      </DialogHeader>
                      
                      {selectedWard && (
                        <div className="space-y-6">
                          {/* Ward Overview */}
                          <div className="grid grid-cols-3 gap-4">
                            <StatCard
                              title="Total Beds"
                              value={selectedWard.totalBeds}
                              icon={Bed}
                              variant="default"
                            />
                            <StatCard
                              title="Occupied"
                              value={selectedWard.occupiedBeds}
                              icon={Users}
                              variant="default"
                            />
                            <StatCard
                              title="Available"
                              value={selectedWard.availableBeds}
                              icon={Bed}
                              variant="success"
                            />
                          </div>

                          {/* Ward Info */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h4 className="font-semibold">Ward Information</h4>
                              <div className="space-y-1 text-sm">
                                <p><strong>Department:</strong> {selectedWard.department}</p>
                                <p><strong>Floor:</strong> {selectedWard.floor}</p>
                                <p><strong>Nurse in Charge:</strong> {selectedWard.nurseInCharge}</p>
                                <p><strong>Occupancy Rate:</strong> {getOccupancyPercentage(selectedWard.occupiedBeds, selectedWard.totalBeds)}%</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-semibold">Capacity Status</h4>
                              <Progress 
                                value={getOccupancyPercentage(selectedWard.occupiedBeds, selectedWard.totalBeds)} 
                                className="h-3"
                              />
                              <p className="text-xs text-muted-foreground">
                                {selectedWard.occupiedBeds} of {selectedWard.totalBeds} beds occupied
                              </p>
                            </div>
                          </div>

                          {/* Current Patients */}
                          <div className="space-y-3">
                            <h4 className="font-semibold">Current Patients</h4>
                            {selectedWard.patients.length > 0 ? (
                              <div className="space-y-2">
                                {selectedWard.patients.map((patient) => (
                                  <Card key={patient.id} className="p-3">
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <p className="font-medium">{patient.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                          Bed: {patient.bed} | Admitted: {patient.admissionDate}
                                        </p>
                                      </div>
                                      <Badge variant={patient.condition === 'Critical' ? 'destructive' : 'default'}>
                                        {patient.condition}
                                      </Badge>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No patients currently assigned to this ward.</p>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-3">
                            <Button className="medical-button">
                              Assign Patient
                            </Button>
                            <Button variant="outline">
                              Manage Beds
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default Wards