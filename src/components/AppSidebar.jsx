import { 
  Activity, 
  Calendar, 
  Users, 
  Bed, 
  Package, 
  FileText, 
  Monitor, 
  AlertTriangle,
  Home,
  Stethoscope
} from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import useAuthStore from '../store/authStore'

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
    roles: ['doctor', 'staff', 'admin']
  },
  {
    title: 'Patients',
    url: '/patients',
    icon: Users,
    roles: ['doctor', 'staff', 'admin']
  },
  {
    title: 'Surgeries',
    url: '/surgeries',
    icon: Activity,
    roles: ['doctor', 'staff', 'admin']
  },
  {
    title: 'Doctors',
    url: '/doctors',
    icon: Stethoscope,
    roles: ['admin', 'staff']
  },
  {
    title: 'Ward Allotment',
    url: '/wards',
    icon: Bed,
    roles: ['doctor', 'staff', 'admin']
  },
  {
    title: 'Inventory',
    url: '/inventory',
    icon: Package,
    roles: ['staff', 'admin']
  },
  {
    title: 'Prescriptions',
    url: '/prescriptions',
    icon: FileText,
    roles: ['doctor', 'staff']
  },
  {
    title: 'Monitoring',
    url: '/monitoring',
    icon: Monitor,
    roles: ['doctor', 'staff', 'admin']
  },
  {
    title: 'Emergency',
    url: '/emergency',
    icon: AlertTriangle,
    roles: ['doctor', 'staff', 'admin']
  }
]

export function AppSidebar() {
  const { collapsed } = useSidebar()
  const location = useLocation()
  const { user } = useAuthStore()
  const currentPath = location.pathname

  const isActive = (path) => currentPath === path || currentPath.startsWith(path + '/')
  
  const getNavCls = ({ isActive }) =>
    isActive ? 'bg-primary text-primary-foreground font-medium shadow-[var(--shadow-medical)]' : 'hover:bg-accent hover:text-accent-foreground'

  // Filter navigation items based on user role
  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(user?.role)
  )

  return (
    <Sidebar 
      className={collapsed ? 'w-14' : 'w-64'} 
      collapsible
    >
      <SidebarContent className="bg-sidebar">
        <div className="p-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">MediLink</h2>
                <p className="text-xs text-sidebar-foreground/60">Hospital Management</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            {!collapsed ? 'Navigation' : ''}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${getNavCls({ isActive: isActive(item.url) })}`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User info at bottom */}
        {user && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            {!collapsed ? (
              <div className="flex items-center space-x-3">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            ) : (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover mx-auto"
              />
            )}
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}