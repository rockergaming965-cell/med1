import { create } from 'zustand'

// Mock patient data
const mockPatients = [
  {
    id: 'P001',
    name: 'Kanishk',
    age: 20,
    gender: 'Male',
    phone: '1234567890',
    email: 'k@medilik.com',
    address: 'Mumbai',
    bloodGroup: 'O+',
    emergencyContact: {
      name: 'A',
      phone: '1234',
      relation: 'Roomate'
    },
    medicalHistory: [
      'Hypertension',
      'Type 2 Diabetes',
      'Previous heart surgery (2019)'
    ],
    currentCondition: 'Stable',
    severity: 'medium',
    admissionDate: '25/10/2025',
    assignedDoctor: 'Dr. Keshav',
    ward: 'Cardiology - Room 301',
    vitals: {
      heartRate: 78,
      bloodPressure: '120/80',
      temperature: 98.6,
      oxygenSaturation: 98,
      respiratoryRate: 16
    },
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' }
    ],
    labResults: [
      { test: 'Blood Glucose', value: '145 mg/dL', date: '2024-01-20' },
      { test: 'HbA1c', value: '7.2%', date: '2024-01-18' }
    ]
  },
  {
    id: 'P002',
    name: 'Kanan',
    age: 20,
    gender: 'Female',
    phone: '9087654321',
    email: 'k2@medilink.com',
    address: 'Mumbai',
    bloodGroup: 'AB-',
    emergencyContact: {
      name: 'B',
      phone: '123452',
      relation: 'Father'
    },
    medicalHistory: [
      'Asthma',
      'Seasonal allergies'
    ],
    currentCondition: 'Critical',
    severity: 'high',
    admissionDate: '22/10/2025',
    assignedDoctor: 'Dr. Keshav',
    ward: 'ICU - Room 105',
    vitals: {
      heartRate: 110,
      bloodPressure: '90/60',
      temperature: 101.2,
      oxygenSaturation: 94,
      respiratoryRate: 22
    },
    medications: [
      { name: 'Albuterol', dosage: '90mcg', frequency: 'As needed' },
      { name: 'Prednisone', dosage: '20mg', frequency: 'Once daily' }
    ],
    labResults: [
      { test: 'White Blood Count', value: '12,000/μL', date: '2024-01-22' },
      { test: 'C-Reactive Protein', value: '15 mg/L', date: '2024-01-22' }
    ]
  },
  {
    id: 'P003',
    name: 'Keshav',
    age: 20,
    gender: 'Male',
    phone: '2345678901',
    email: 'k3@medikink.com',
    address: 'Mumbai',
    bloodGroup: 'B+',
    emergencyContact: {
      name: 'C',
      phone: '345',
      relation: 'Mother'
    },
    medicalHistory: [
      'Coronary artery disease',
      'High cholesterol',
      'Arthritis'
    ],
    currentCondition: 'Good',
    severity: 'low',
    admissionDate: '28/10/2025',
    assignedDoctor: 'Dr. Manik',
    ward: 'General - Room 210',
    vitals: {
      heartRate: 72,
      bloodPressure: '130/85',
      temperature: 98.4,
      oxygenSaturation: 97,
      respiratoryRate: 14
    },
    medications: [
      { name: 'Atorvastatin', dosage: '40mg', frequency: 'Once daily' },
      { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily' }
    ],
    labResults: [
      { test: 'Total Cholesterol', value: '180 mg/dL', date: '2024-01-15' },
      { test: 'LDL', value: '95 mg/dL', date: '2024-01-15' }
    ]
  }
]

const usePatientStore = create((set, get) => ({
  patients: mockPatients,
  selectedPatient: null,
  searchQuery: '',
  filterSeverity: 'all',
  
  // Get patients with filters applied
  getFilteredPatients: () => {
    const { patients, searchQuery, filterSeverity } = get()
    return patients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           patient.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSeverity = filterSeverity === 'all' || patient.severity === filterSeverity
      return matchesSearch && matchesSeverity
    })
  },
  
  // AI Summary function (mock)
  generateAISummary: (patientId) => {
    const patient = get().patients.find(p => p.id === patientId)
    if (!patient) return ''
    
    // Mock AI summary generation
    const severity = patient.severity
    const conditions = patient.medicalHistory.join(', ')
    const currentStatus = patient.currentCondition
    
    return `Patient ${patient.name} (${patient.age}yo ${patient.gender}) presents with ${conditions}. 
            Current status: ${currentStatus}. Vitals show HR: ${patient.vitals.heartRate}, 
            BP: ${patient.vitals.bloodPressure}, O2: ${patient.vitals.oxygenSaturation}%. 
            ${severity === 'high' ? 'Requires immediate attention and close monitoring.' : 
              severity === 'medium' ? 'Stable but needs regular monitoring.' : 
              'Condition is stable with routine care sufficient.'}`
  },
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterSeverity: (severity) => set({ filterSeverity: severity }),
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  
  // Update patient vitals (for real-time monitoring simulation)
  updatePatientVitals: (patientId, vitals) => {
    set((state) => ({
      patients: state.patients.map(patient =>
        patient.id === patientId 
          ? { ...patient, vitals: { ...patient.vitals, ...vitals } }
          : patient
      )
    }))
  }
}))

export default usePatientStore