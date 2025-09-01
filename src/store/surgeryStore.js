import { create } from 'zustand'

// Mock surgery data
const mockSurgeries = [
  {
    id: 'S001',
    patientId: 'P001',
    patientName: 'Dhruti',
    surgeryType: 'Cardiac Bypass',
    priority: 'high',
    status: 'scheduled',
    scheduledDate: '2024-01-25',
    scheduledTime: '08:00',
    duration: 240, // minutes
    surgeon: 'Dr. Keshav',
    assistantSurgeon: 'Dr. Kanishk',
    anesthesiologist: 'Dr. Kanan',
    operatingRoom: 'OR-1',
    notes: 'Patient requires special cardiac monitoring',
    preOpChecklist: [
      { item: 'Blood work completed', completed: true },
      { item: 'Consent forms signed', completed: true },
      { item: 'Pre-op fasting confirmed', completed: false },
      { item: 'Anesthesia consultation', completed: true }
    ]
  },
  {
    id: 'S002',
    patientId: 'P002',
    patientName: 'Yashvi',
    surgeryType: 'Emergency Appendectomy',
    priority: 'urgent',
    status: 'in-progress',
    scheduledDate: '2024-01-23',
    scheduledTime: '14:30',
    duration: 90,
    surgeon: 'Dr. Vedant',
    assistantSurgeon: 'Dr. Kanan',
    anesthesiologist: 'Dr. Manik',
    operatingRoom: 'OR-3',
    notes: 'Emergency case - acute appendicitis',
    preOpChecklist: [
      { item: 'Blood work completed', completed: true },
      { item: 'Consent forms signed', completed: true },
      { item: 'Pre-op fasting confirmed', completed: true },
      { item: 'Anesthesia consultation', completed: true }
    ]
  },
  {
    id: 'S003',
    patientId: 'P003',
    patientName: 'Vedant', 
    surgeryType: 'Knee Replacement',
    priority: 'medium',
    status: 'pending',
    scheduledDate: '2024-01-28',
    scheduledTime: '10:00',
    duration: 180,
    surgeon: 'Dr. Kanishk',
    assistantSurgeon: 'Dr. Kanan',
    anesthesiologist: 'Dr. Keshav',
    operatingRoom: 'OR-2',
    notes: 'Routine knee replacement surgery',
    preOpChecklist: [
      { item: 'Blood work completed', completed: false },
      { item: 'Consent forms signed', completed: true },
      { item: 'Pre-op fasting confirmed', completed: false },
      { item: 'Anesthesia consultation', completed: false }
    ]
  }
]

const useSurgeryStore = create((set, get) => ({
  surgeries: mockSurgeries,
  selectedSurgery: null,
  
  // AI Optimization function (mock)
  optimizeSurgerySchedule: () => {
    const { surgeries } = get()
    
    // Mock AI optimization logic
    const optimized = [...surgeries].sort((a, b) => {
      // Priority ranking: urgent > high > medium > low
      const priorityRank = { urgent: 4, high: 3, medium: 2, low: 1 }
      return priorityRank[b.priority] - priorityRank[a.priority]
    })
    
    // Simulate AI reasoning
    const reasoning = [
      "Prioritized emergency and urgent cases first",
      "Optimized OR utilization based on surgery duration",
      "Considered surgeon availability and specializations",
      "Minimized patient wait times while maximizing throughput"
    ]
    
    set({ surgeries: optimized })
    return reasoning
  },
  
  // Get surgeries by status
  getSurgeriesToday: () => {
    const today = new Date().toISOString().split('T')[0]
    return get().surgeries.filter(s => s.scheduledDate === today)
  },
  
  getUpcomingSurgeries: () => {
    const today = new Date()
    return get().surgeries.filter(s => new Date(s.scheduledDate) > today)
  },
  
  // Update surgery status
  updateSurgeryStatus: (surgeryId, status) => {
    set((state) => ({
      surgeries: state.surgeries.map(surgery =>
        surgery.id === surgeryId ? { ...surgery, status } : surgery
      )
    }))
  },
  
  // Add new surgery
  addSurgery: (surgeryData) => {
    const newSurgery = {
      id: `S${String(Date.now()).slice(-3)}`,
      ...surgeryData,
      status: 'pending',
      preOpChecklist: [
        { item: 'Blood work completed', completed: false },
        { item: 'Consent forms signed', completed: false },
        { item: 'Pre-op fasting confirmed', completed: false },
        { item: 'Anesthesia consultation', completed: false }
      ]
    }
    
    set((state) => ({
      surgeries: [...state.surgeries, newSurgery]
    }))
  },
  
  setSelectedSurgery: (surgery) => set({ selectedSurgery: surgery })
}))

export default useSurgeryStore