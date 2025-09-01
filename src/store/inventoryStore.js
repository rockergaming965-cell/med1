import { create } from 'zustand'

// Mock inventory data
const mockInventory = [
  {
    id: 'M001',
    name: 'Paracetamol',
    category: 'Analgesic',
    currentStock: 150,
    minStock: 50,
    maxStock: 500,
    unit: 'tablets',
    costPerUnit: 0.25,
    supplier: 'PharmaCorp',
    batchNumber: 'PC2024-001',
    expiryDate: '29/10/2027',
    location: 'Pharmacy - Shelf A1',
    status: 'adequate'
  },
  {
    id: 'M002',
    name: 'Insulin (Rapid Acting)',
    category: 'Hormone',
    currentStock: 25,
    minStock: 30,
    maxStock: 100,
    unit: 'vials',
    costPerUnit: 45.99,
    supplier: 'MediSupply Inc',
    batchNumber: 'MS2024-089',
    expiryDate: '28/08/2028',
    location: 'Pharmacy - Refrigerator B',
    status: 'low'
  },
  {
    id: 'M003',
    name: 'Surgical Masks',
    category: 'PPE',
    currentStock: 2500,
    minStock: 1000,
    maxStock: 5000,
    unit: 'pieces',
    costPerUnit: 0.15,
    supplier: 'SafetyFirst Ltd',
    batchNumber: 'SF2024-156',
    expiryDate: '1/1/2030',
    location: 'Storage - Aisle C',
    status: 'adequate'
  },
  {
    id: 'M004',
    name: 'Morphine Sulfate',
    category: 'Analgesic (Controlled)',
    currentStock: 8,
    minStock: 15,
    maxStock: 50,
    unit: 'vials',
    costPerUnit: 12.50,
    supplier: 'SecureMeds',
    batchNumber: 'SM2024-034',
    expiryDate: '29/12/2025',
    location: 'Pharmacy - Secure Cabinet',
    status: 'critical'
  },
  {
    id: 'M005',
    name: 'Antibiotics - Amoxicillin',
    category: 'Antibiotic',
    currentStock: 200,
    minStock: 100,
    maxStock: 400,
    unit: 'capsules',
    costPerUnit: 0.35,
    supplier: 'PharmaCorp',
    batchNumber: 'PC2024-067',
    expiryDate: '12/06/2026',
    location: 'Pharmacy - Shelf B2',
    status: 'adequate'
  }
]

const useInventoryStore = create((set, get) => ({
  inventory: mockInventory,
  lowStockAlerts: [],
  expiryAlerts: [],
  
  // Initialize alerts
  updateAlerts: () => {
    const { inventory } = get()
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    // Low stock alerts
    const lowStock = inventory.filter(item => item.currentStock <= item.minStock)
    
    // Expiry alerts (items expiring within 30 days)
    const expiringSoon = inventory.filter(item => {
      const expiryDate = new Date(item.expiryDate)
      return expiryDate <= thirtyDaysFromNow && expiryDate > today
    })
    
    set({
      lowStockAlerts: lowStock,
      expiryAlerts: expiringSoon
    })
  },
  
  // AI-powered reorder suggestions
  generateReorderSuggestions: () => {
    const { inventory } = get()
    
    const suggestions = inventory
      .filter(item => item.currentStock <= item.minStock * 1.2) // 20% buffer
      .map(item => {
        // Mock AI calculation for optimal order quantity
        const usageRate = Math.random() * 10 + 5 // Mock daily usage
        const leadTime = Math.random() * 7 + 3 // Mock lead time in days
        const safetyStock = usageRate * leadTime * 1.5 // Safety buffer
        const optimalOrder = Math.max(
          item.maxStock - item.currentStock,
          safetyStock
        )
        
        return {
          ...item,
          suggestedQuantity: Math.ceil(optimalOrder),
          reasoning: [
            `Current stock (${item.currentStock}) below optimal level`,
            `Estimated daily usage: ${usageRate.toFixed(1)} ${item.unit}`,
            `Supplier lead time: ${leadTime.toFixed(1)} days`,
            `Recommended order: ${Math.ceil(optimalOrder)} ${item.unit}`
          ]
        }
      })
    
    return suggestions
  },
  
  // Drug interaction checker (mock AI)
  checkDrugInteractions: (medications) => {
    // Mock interaction database
    const interactions = [
      {
        drugs: ['Warfarin', 'Aspirin'],
        severity: 'high',
        description: 'Increased bleeding risk when used together',
        recommendation: 'Monitor INR closely, consider alternative'
      },
      {
        drugs: ['Insulin', 'Metformin'],
        severity: 'medium',
        description: 'May enhance hypoglycemic effects',
        recommendation: 'Monitor blood glucose levels regularly'
      },
      {
        drugs: ['Morphine', 'Lorazepam'],
        severity: 'high',
        description: 'Increased CNS depression and respiratory risk',
        recommendation: 'Avoid combination or reduce doses significantly'
      }
    ]
    
    const foundInteractions = []
    
    // Check all medication pairs
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const drug1 = medications[i].name || medications[i]
        const drug2 = medications[j].name || medications[j]
        
        const interaction = interactions.find(int =>
          (int.drugs.includes(drug1) && int.drugs.includes(drug2))
        )
        
        if (interaction) {
          foundInteractions.push({
            ...interaction,
            affectedDrugs: [drug1, drug2]
          })
        }
      }
    }
    
    return foundInteractions
  },
  
  // Update stock levels
  updateStock: (itemId, newStock) => {
    set((state) => ({
      inventory: state.inventory.map(item =>
        item.id === itemId 
          ? { 
              ...item, 
              currentStock: newStock,
              status: newStock <= item.minStock ? 'low' : 
                     newStock <= item.minStock * 0.5 ? 'critical' : 'adequate'
            }
          : item
      )
    }))
    
    // Update alerts after stock change
    get().updateAlerts()
  },
  
  // Add new inventory item
  addInventoryItem: (itemData) => {
    const newItem = {
      id: `M${String(Date.now()).slice(-3)}`,
      ...itemData,
      status: itemData.currentStock <= itemData.minStock ? 'low' : 'adequate'
    }
    
    set((state) => ({
      inventory: [...state.inventory, newItem]
    }))
  }
}))

// Initialize alerts on store creation
useInventoryStore.getState().updateAlerts()

export default useInventoryStore