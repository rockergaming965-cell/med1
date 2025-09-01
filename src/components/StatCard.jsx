import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue,
  variant = 'default',
  className 
}) => {
  const getVariantStyles = (variant) => {
    switch (variant) {
      case 'emergency':
        return 'emergency-card border-destructive/30'
      case 'success':
        return 'success-card border-success/30'
      case 'warning':
        return 'warning-card border-warning/30'
      default:
        return 'medical-card'
    }
  }

  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-success'
    if (trend === 'down') return 'text-destructive'
    return 'text-muted-foreground'
  }

  return (
    <Card className={cn('stat-card', getVariantStyles(variant), className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className={cn(
            'h-5 w-5',
            variant === 'emergency' ? 'text-destructive' :
            variant === 'success' ? 'text-success' :
            variant === 'warning' ? 'text-warning' :
            'text-primary'
          )} />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mb-2">
            {subtitle}
          </p>
        )}
        {trend && trendValue && (
          <div className={cn('flex items-center text-xs', getTrendColor(trend))}>
            <span className="mr-1">
              {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
            </span>
            {trendValue}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default StatCard