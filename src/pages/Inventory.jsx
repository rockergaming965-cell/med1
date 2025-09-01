import { useState } from 'react'
import { Search, Package, AlertTriangle, Plus, TrendingDown, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import useInventoryStore from '../store/inventoryStore'
import StatCard from '../components/StatCard'

const Inventory = () => {
  const { 
    inventory, 
    lowStockAlerts, 
    expiryAlerts,
    generateReorderSuggestions,
    updateStock
  } = useInventoryStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [reorderSuggestions, setReorderSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStockVariant = (status) => {
    switch (status) {
      case 'adequate': return 'default'
      case 'low': return 'secondary'
      case 'critical': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStockPercentage = (current, max) => {
    return Math.round((current / max) * 100)
  }

  const handleGenerateSuggestions = () => {
    const suggestions = generateReorderSuggestions()
    setReorderSuggestions(suggestions)
    setShowSuggestions(true)
  }

  // Calculate stats
  const totalItems = inventory.length
  const lowStockItems = lowStockAlerts.length
  const expiringItems = expiryAlerts.length
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage medical supplies</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleGenerateSuggestions}>
            <TrendingDown className="w-4 h-4 mr-2" />
            AI Reorder Suggestions
          </Button>
          <Button className="medical-button">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {(lowStockAlerts.length > 0 || expiryAlerts.length > 0) && (
        <div className="space-y-3">
          {lowStockAlerts.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{lowStockAlerts.length} items</strong> are running low on stock and need immediate attention.
              </AlertDescription>
            </Alert>
          )}
          {expiryAlerts.length > 0 && (
            <Alert className="border-warning/50 bg-warning/10">
              <Calendar className="h-4 w-4 text-warning" />
              <AlertDescription>
                <strong>{expiryAlerts.length} items</strong> are expiring within 30 days.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* AI Reorder Suggestions */}
      {showSuggestions && reorderSuggestions.length > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-bold">AI</span>
              </div>
              <span>Reorder Suggestions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reorderSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-3 bg-white rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{suggestion.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Suggested quantity: {suggestion.suggestedQuantity} {suggestion.unit}
                      </p>
                    </div>
                    <Button size="sm">Order Now</Button>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    {suggestion.reasoning.map((reason, index) => (
                      <p key={index}>• {reason}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Items"
          value={totalItems}
          icon={Package}
          variant="default"
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowStockItems}
          icon={AlertTriangle}
          variant="emergency"
        />
        <StatCard
          title="Expiring Soon"
          value={expiringItems}
          icon={Calendar}
          variant="warning"
        />
        <StatCard
          title="Total Value"
          value={`₹${totalValue.toLocaleString()}`}
          subtitle="Current inventory worth"
          variant="default"
        />
      </div>

      {/* Search */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Search Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name, category, or item ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInventory.map((item) => (
          <Card key={item.id} className="medical-card hover:shadow-[var(--shadow-medical)] transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription>ID: {item.id}</CardDescription>
                </div>
                <Badge variant={getStockVariant(item.status)}>
                  {item.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Stock Level</span>
                    <span>{item.currentStock}/{item.maxStock} {item.unit}</span>
                  </div>
                  <Progress 
                    value={getStockPercentage(item.currentStock, item.maxStock)} 
                    className="h-2"
                  />
                </div>

                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{item.category}</span>
                  <span className="text-muted-foreground">Cost/Unit:</span>
                  <span className="font-medium">₹{item.costPerUnit}</span>
                  <span className="text-muted-foreground">Supplier:</span>
                  <span className="font-medium text-xs">{item.supplier}</span>
                  <span className="text-muted-foreground">Expires:</span>
                  <span className="font-medium text-xs">{item.expiryDate}</span>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setSelectedItem(item)}
                    >
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{selectedItem?.name}</DialogTitle>
                      <DialogDescription>Item ID: {selectedItem?.id}</DialogDescription>
                    </DialogHeader>
                    
                    {selectedItem && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Current Stock:</span>
                              <span className="font-medium">{selectedItem.currentStock} {selectedItem.unit}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Min Stock:</span>
                              <span className="font-medium">{selectedItem.minStock} {selectedItem.unit}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Max Stock:</span>
                              <span className="font-medium">{selectedItem.maxStock} {selectedItem.unit}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Cost per Unit:</span>
                              <span className="font-medium">₹{selectedItem.costPerUnit}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Category:</span>
                              <span className="font-medium">{selectedItem.category}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Supplier:</span>
                              <span className="font-medium">{selectedItem.supplier}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Batch Number:</span>
                              <span className="font-medium">{selectedItem.batchNumber}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Expiry Date:</span>
                              <span className="font-medium">{selectedItem.expiryDate}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold">Storage Location</h4>
                          <p className="text-sm text-muted-foreground">{selectedItem.location}</p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold">Stock Level</h4>
                          <Progress 
                            value={getStockPercentage(selectedItem.currentStock, selectedItem.maxStock)} 
                            className="h-3"
                          />
                          <p className="text-xs text-muted-foreground">
                            {selectedItem.currentStock} of {selectedItem.maxStock} {selectedItem.unit} available
                          </p>
                        </div>

                        <div className="flex space-x-3">
                          <Button className="medical-button">
                            Update Stock
                          </Button>
                          <Button variant="outline">
                            Reorder Item
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

      {filteredInventory.length === 0 && (
        <Card className="medical-card">
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No inventory items found matching your criteria.</p>
            <Button variant="outline" className="mt-4" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Inventory