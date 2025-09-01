import { useState } from 'react'
import { Search, UserPlus, Stethoscope, Calendar, Phone, Mail, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import StatCard from '../components/StatCard'

// Mock doctors data
const mockDoctors = [
  {
    id: 'D001',
    name: 'Dr. Keshav Sharma',
    specialty: 'Cardiology',
    department: 'Cardiology',
    experience: 15,
    phone: '+91 98765 43210',
    email: 'keshav.sharma@medilink.com',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
    status: 'available',
    shift: 'Morning (8:00 AM - 4:00 PM)',
    qualifications: ['MBBS', 'MD Cardiology', 'Fellowship in Interventional Cardiology'],
    languages: ['English', 'Hindi', 'Gujarati'],
    consultationFee: 1500,
    rating: 4.8,
    totalPatients: 245,
    todayAppointments: 8,
    upcomingSurgeries: 3
  },
  {
    id: 'D002',
    name: 'Dr. Manik Patel',
    specialty: 'Emergency Medicine',
    department: 'Emergency',
    experience: 8,
    phone: '+91 98765 43211',
    email: 'manik.patel@medilink.com',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face',
    status: 'busy',
    shift: 'Night (8:00 PM - 8:00 AM)',
    qualifications: ['MBBS', 'MD Emergency Medicine', 'ATLS Certified'],
    languages: ['English', 'Hindi'],
    consultationFee: 1200,
    rating: 4.6,
    totalPatients: 189,
    todayAppointments: 12,
    upcomingSurgeries: 1
  },
  {
    id: 'D003',
    name: 'Dr. Kanishk Gupta',
    specialty: 'Orthopedics',
    department: 'Orthopedics',
    experience: 12,
    phone: '+91 98765 43212',
    email: 'kanishk.gupta@medilink.com',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
    status: 'available',
    shift: 'Morning (7:00 AM - 3:00 PM)',
    qualifications: ['MBBS', 'MS Orthopedics', 'Fellowship in Joint Replacement'],
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationFee: 1300,
    rating: 4.9,
    totalPatients: 198,
    todayAppointments: 6,
    upcomingSurgeries: 2
  },
  {
    id: 'D004',
    name: 'Dr. Vedant Singh',
    specialty: 'General Surgery',
    department: 'Surgery',
    experience: 10,
    phone: '+91 98765 43213',
    email: 'vedant.singh@medilink.com',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
    status: 'in-surgery',
    shift: 'Afternoon (12:00 PM - 8:00 PM)',
    qualifications: ['MBBS', 'MS General Surgery', 'FICS'],
    languages: ['English', 'Hindi'],
    consultationFee: 1100,
    rating: 4.7,
    totalPatients: 167,
    todayAppointments: 4,
    upcomingSurgeries: 4
  }
]

const Doctors = () => {
  const [doctors] = useState(mockDoctors)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusVariant = (status) => {
    switch (status) {
      case 'available': return 'default'
      case 'busy': return 'secondary'
      case 'in-surgery': return 'destructive'
      case 'off-duty': return 'outline'
      default: return 'secondary'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-success'
      case 'busy': return 'text-warning'
      case 'in-surgery': return 'text-destructive'
      case 'off-duty': return 'text-muted-foreground'
      default: return 'text-muted-foreground'
    }
  }

  // Calculate stats
  const totalDoctors = doctors.length
  const availableDoctors = doctors.filter(d => d.status === 'available').length
  const busyDoctors = doctors.filter(d => d.status === 'busy' || d.status === 'in-surgery').length
  const avgRating = (doctors.reduce((sum, d) => sum + d.rating, 0) / doctors.length).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Doctor Management</h1>
          <p className="text-muted-foreground">Manage medical staff and schedules</p>
        </div>
        <Button className="medical-button">
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Doctor
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Doctors"
          value={totalDoctors}
          icon={Stethoscope}
          variant="default"
        />
        <StatCard
          title="Available Now"
          value={availableDoctors}
          icon={UserPlus}
          variant="success"
        />
        <StatCard
          title="Currently Busy"
          value={busyDoctors}
          icon={Calendar}
          variant="warning"
        />
        <StatCard
          title="Average Rating"
          value={`${avgRating}/5.0`}
          subtitle="Patient satisfaction"
          variant="default"
        />
      </div>

      {/* Search */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Search Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name, specialty, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="medical-card hover:shadow-[var(--shadow-medical)] transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={doctor.avatar} alt={doctor.name} />
                  <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{doctor.name}</CardTitle>
                  <CardDescription>{doctor.specialty}</CardDescription>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant={getStatusVariant(doctor.status)}>
                      {doctor.status.replace('-', ' ')}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      ⭐ {doctor.rating}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Experience:</span>
                  <span className="font-medium">{doctor.experience} years</span>
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-medium">{doctor.department}</span>
                  <span className="text-muted-foreground">Today's Patients:</span>
                  <span className="font-medium">{doctor.todayAppointments}</span>
                  <span className="text-muted-foreground">Consultation Fee:</span>
                  <span className="font-medium">₹{doctor.consultationFee}</span>
                </div>

                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{doctor.shift}</span>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setSelectedDoctor(doctor)}
                    >
                      View Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{selectedDoctor?.name}</DialogTitle>
                      <DialogDescription>{selectedDoctor?.specialty} Specialist</DialogDescription>
                    </DialogHeader>
                    
                    {selectedDoctor && (
                      <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="profile">Profile</TabsTrigger>
                          <TabsTrigger value="schedule">Schedule</TabsTrigger>
                          <TabsTrigger value="performance">Performance</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="profile" className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-20 h-20">
                              <AvatarImage src={selectedDoctor.avatar} alt={selectedDoctor.name} />
                              <AvatarFallback>{selectedDoctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-xl font-semibold">{selectedDoctor.name}</h3>
                              <p className="text-muted-foreground">{selectedDoctor.specialty}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge variant={getStatusVariant(selectedDoctor.status)}>
                                  {selectedDoctor.status.replace('-', ' ')}
                                </Badge>
                                <span className="text-sm">⭐ {selectedDoctor.rating}/5.0</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{selectedDoctor.phone}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{selectedDoctor.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{selectedDoctor.department} Department</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Experience: {selectedDoctor.experience} years</p>
                              <p className="text-sm font-medium">Consultation Fee: ₹{selectedDoctor.consultationFee}</p>
                              <p className="text-sm font-medium">Total Patients: {selectedDoctor.totalPatients}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-semibold">Qualifications</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedDoctor.qualifications.map((qual, index) => (
                                <Badge key={index} variant="secondary">{qual}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-semibold">Languages</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedDoctor.languages.map((lang, index) => (
                                <Badge key={index} variant="outline">{lang}</Badge>
                              ))}
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="schedule" className="space-y-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">Current Shift</h4>
                              <Badge variant={getStatusVariant(selectedDoctor.status)}>
                                {selectedDoctor.status.replace('-', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{selectedDoctor.shift}</p>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <StatCard
                                title="Today's Appointments"
                                value={selectedDoctor.todayAppointments}
                                icon={Calendar}
                                variant="default"
                              />
                              <StatCard
                                title="Upcoming Surgeries"
                                value={selectedDoctor.upcomingSurgeries}
                                icon={Stethoscope}
                                variant="default"
                              />
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="performance" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <StatCard
                              title="Patient Rating"
                              value={`${selectedDoctor.rating}/5.0`}
                              subtitle="Based on patient feedback"
                              variant="success"
                            />
                            <StatCard
                              title="Total Patients"
                              value={selectedDoctor.totalPatients}
                              subtitle="Lifetime count"
                              variant="default"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-semibold">Recent Achievements</h4>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-success rounded-full"></div>
                                <span className="text-sm">Completed 50+ successful surgeries this year</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span className="text-sm">Maintained 95%+ patient satisfaction rate</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-warning rounded-full"></div>
                                <span className="text-sm">Published 3 research papers this year</span>
                              </div>
                            </div>
                          </div>
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

      {filteredDoctors.length === 0 && (
        <Card className="medical-card">
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No doctors found matching your search criteria.</p>
            <Button variant="outline" className="mt-4" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Doctors