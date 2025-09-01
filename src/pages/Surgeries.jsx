import { useState } from 'react'
import { Calendar, Clock, User, Activity, Lightbulb, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import useSurgeryStore from '../store/surgeryStore'
import StatCard from '../components/StatCard'

const Surgeries = () => {
  const { 
    surgeries, 
    optimizeSurgerySchedule, 
    updateSurgeryStatus,
    getSurgeriesToday,
    getUpcomingSurgeries
  } = useSurgeryStore()

  const [selectedSurgery, setSelectedSurgery] = useState(null)
  const [optimizationReasoning, setOptimizationReasoning] = useState([])
  const [showOptimization, setShowOptimization] = useState(false)

  const handleOptimize = () => {
    const reasoning = optimizeSurgerySchedule()
    setOptimizationReasoning(reasoning)
    setShowOptimization(true)
  }

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'urgent': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed': return 'secondary'
      case 'in-progress': return 'default'
      case 'scheduled': return 'outline'
      case 'pending': return 'secondary'
      default: return 'secondary'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success'
      case 'in-progress': return 'text-primary'
      case 'scheduled': return 'text-warning'
      case 'pending': return 'text-muted-foreground'
      default: return 'text-muted-foreground'
    }
  }

  // Calculate stats
  const todaySurgeries = getSurgeriesToday()
  const upcomingSurgeries = getUpcomingSurgeries()
  const urgentSurgeries = surgeries.filter(s => s.priority === 'urgent' || s.priority === 'high')
  const completedSurgeries = surgeries.filter(s => s.status === 'completed')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Surgery Management</h1>
          <p className="text-muted-foreground">Schedule and monitor surgical procedures</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Surgery
          </Button>
          <Button onClick={handleOptimize} className="medical-button">
            <Lightbulb className="w-4 h-4 mr-2" />
            AI Optimize Schedule
          </Button>
        </div>
      </div>

      {/* AI Optimization Alert */}
      {showOptimization && (
        <Alert className="border-primary/30 bg-primary/5">
          <Lightbulb className="h-4 w-4 text-primary" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold text-primary">Schedule optimized successfully!</p>
              <ul className="text-sm space-y-1">
                {optimizationReasoning.map((reason, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-success mt-0.5 flex-shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Today's Surgeries"
          value={todaySurgeries.length}
          icon={Calendar}
          variant="default"
        />
        <StatCard
          title="Urgent Cases"
          value={urgentSurgeries.length}
          icon={Activity}
          variant="emergency"
        />
        <StatCard
          title="Upcoming"
          value={upcomingSurgeries.length}
          subtitle="Next 7 days"
          icon={Clock}
          variant="default"
        />
        <StatCard
          title="Completed Today"
          value={completedSurgeries.length}
          icon={CheckCircle}
          variant="success"
        />
      </div>

      {/* Surgery Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Pending Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
            <h3 className="font-semibold text-foreground">Pending</h3>
            <Badge variant="secondary">
              {surgeries.filter(s => s.status === 'pending').length}
            </Badge>
          </div>
          <div className="space-y-3">
            {surgeries.filter(s => s.status === 'pending').map((surgery) => (
              <SurgeryCard 
                key={surgery.id} 
                surgery={surgery} 
                onSelect={setSelectedSurgery}
                onStatusChange={updateSurgeryStatus}
              />
            ))}
          </div>
        </div>

        {/* Scheduled Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <h3 className="font-semibold text-foreground">Scheduled</h3>
            <Badge variant="secondary">
              {surgeries.filter(s => s.status === 'scheduled').length}
            </Badge>
          </div>
          <div className="space-y-3">
            {surgeries.filter(s => s.status === 'scheduled').map((surgery) => (
              <SurgeryCard 
                key={surgery.id} 
                surgery={surgery} 
                onSelect={setSelectedSurgery}
                onStatusChange={updateSurgeryStatus}
              />
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <h3 className="font-semibold text-foreground">In Progress</h3>
            <Badge variant="secondary">
              {surgeries.filter(s => s.status === 'in-progress').length}
            </Badge>
          </div>
          <div className="space-y-3">
            {surgeries.filter(s => s.status === 'in-progress').map((surgery) => (
              <SurgeryCard 
                key={surgery.id} 
                surgery={surgery} 
                onSelect={setSelectedSurgery}
                onStatusChange={updateSurgeryStatus}
              />
            ))}
          </div>
        </div>

        {/* Completed Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <h3 className="font-semibold text-foreground">Completed</h3>
            <Badge variant="secondary">
              {surgeries.filter(s => s.status === 'completed').length}
            </Badge>
          </div>
          <div className="space-y-3">
            {surgeries.filter(s => s.status === 'completed').map((surgery) => (
              <SurgeryCard 
                key={surgery.id} 
                surgery={surgery} 
                onSelect={setSelectedSurgery}
                onStatusChange={updateSurgeryStatus}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Surgery Detail Dialog */}
      <Dialog open={selectedSurgery !== null} onOpenChange={() => setSelectedSurgery(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedSurgery?.surgeryType}</DialogTitle>
            <DialogDescription>
              Patient: {selectedSurgery?.patientName} (ID: {selectedSurgery?.patientId})
            </DialogDescription>
          </DialogHeader>
          
          {selectedSurgery && (
            <div className="space-y-6">
              {/* Surgery Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Priority:</span>
                    <Badge variant={getPriorityVariant(selectedSurgery.priority)}>
                      {selectedSurgery.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant={getStatusVariant(selectedSurgery.status)}>
                      {selectedSurgery.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Date:</span>
                    <span className="text-sm font-medium">{selectedSurgery.scheduledDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Time:</span>
                    <span className="text-sm font-medium">{selectedSurgery.scheduledTime}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Duration:</span>
                    <span className="text-sm font-medium">{selectedSurgery.duration} mins</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">OR:</span>
                    <span className="text-sm font-medium">{selectedSurgery.operatingRoom}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Surgeon:</span>
                    <span className="text-sm font-medium">{selectedSurgery.surgeon}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Assistant:</span>
                    <span className="text-sm font-medium">{selectedSurgery.assistantSurgeon}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Pre-Op Checklist */}
              <div className="space-y-3">
                <h4 className="font-semibold">Pre-Operative Checklist</h4>
                <div className="space-y-2">
                  {selectedSurgery.preOpChecklist.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle 
                        className={`w-4 h-4 ${item.completed ? 'text-success' : 'text-muted-foreground'}`} 
                      />
                      <span className={`text-sm ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {item.item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedSurgery.notes && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold">Notes</h4>
                    <p className="text-sm text-muted-foreground">{selectedSurgery.notes}</p>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {selectedSurgery.status === 'pending' && (
                  <Button 
                    onClick={() => updateSurgeryStatus(selectedSurgery.id, 'scheduled')}
                    className="medical-button"
                  >
                    Schedule Surgery
                  </Button>
                )}
                {selectedSurgery.status === 'scheduled' && (
                  <Button 
                    onClick={() => updateSurgeryStatus(selectedSurgery.id, 'in-progress')}
                    className="medical-button"
                  >
                    Start Surgery
                  </Button>
                )}
                {selectedSurgery.status === 'in-progress' && (
                  <Button 
                    onClick={() => updateSurgeryStatus(selectedSurgery.id, 'completed')}
                    variant="outline"
                    className="border-success text-success hover:bg-success hover:text-success-foreground"
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Surgery Card Component
const SurgeryCard = ({ surgery, onSelect, onStatusChange }) => {
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'urgent': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  return (
    <Card className="medical-card cursor-pointer hover:shadow-[var(--shadow-medical)] transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{surgery.patientName}</CardTitle>
          <Badge variant={getPriorityVariant(surgery.priority)} className="text-xs">
            {surgery.priority}
          </Badge>
        </div>
        <CardDescription className="text-sm">
          {surgery.surgeryType}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Calendar className="w-3 h-3" />
            <span>{surgery.scheduledDate}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3" />
            <span>{surgery.scheduledTime} ({surgery.duration}m)</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-3 h-3" />
            <span>{surgery.surgeon}</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-3"
          onClick={() => onSelect(surgery)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}

export default Surgeries