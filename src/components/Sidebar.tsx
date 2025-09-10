import { 
  BarChart3, 
  ShoppingCart, 
  AlertTriangle, 
  Bell, 
  Package,
  Settings, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ currentPage, onPageChange, collapsed, onToggleCollapse }: SidebarProps) {
  const { t } = useLanguage();
  
  const menuItems = [
    { id: 'dashboard', label: t('sidebar.dashboard'), icon: BarChart3 },
    { id: 'orders', label: t('sidebar.orders'), icon: ShoppingCart },
    { id: 'anomalies', label: t('sidebar.anomalies'), icon: AlertTriangle },
    { id: 'notifications', label: t('sidebar.notifications'), icon: Bell },
    { id: 'inventory', label: t('sidebar.inventory'), icon: Package },
    { id: 'settings', label: t('sidebar.settings'), icon: Settings },
  ];

  return (
    <aside className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
                  {!collapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}