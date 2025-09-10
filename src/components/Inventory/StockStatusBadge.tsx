import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface InventoryItem {
  id: number;
  product_name: string;
  current_stock: number;
  max_stock: number;
  min_stock: number;
  created_at: string;
  updated_at: string;
}

interface StockStatusBadgeProps {
  item: InventoryItem;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function StockStatusBadge({ item, showIcon = true, size = 'md' }: StockStatusBadgeProps) {
  const { t } = useLanguage();

  const getStockStatus = (): 'inStock' | 'lowStock' | 'outOfStock' => {
    if (item.current_stock === 0) return 'outOfStock';
    if (item.current_stock <= item.min_stock) return 'lowStock';
    return 'inStock';
  };

  const getStatusIcon = (status: string) => {
    const iconSizes = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };

    const iconClass = iconSizes[size];

    switch (status) {
      case 'outOfStock':
        return <XCircle className={`${iconClass} text-red-500`} />;
      case 'lowStock':
        return <AlertTriangle className={`${iconClass} text-orange-500`} />;
      case 'inStock':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      default:
        return null;
    }
  };

  const getStatusClasses = (status: string) => {
    const baseClasses = 'inline-flex items-center rounded-full font-medium';
    
    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2 py-1 text-xs',
      lg: 'px-3 py-1 text-sm'
    };

    const statusClasses = {
      outOfStock: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      lowStock: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      inStock: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    };

    return `${baseClasses} ${sizeClasses[size]} ${statusClasses[status as keyof typeof statusClasses]}`;
  };

  const getStockPercentage = (): number => {
    return Math.round((item.current_stock / item.max_stock) * 100);
  };

  const getStockWarningLevel = (): 'critical' | 'warning' | 'normal' => {
    const percentage = getStockPercentage();
    if (percentage === 0) return 'critical';
    if (percentage <= 20) return 'warning';
    return 'normal';
  };

  const status = getStockStatus();
  const percentage = getStockPercentage();
  const warningLevel = getStockWarningLevel();

  return (
    <div className="flex flex-col gap-1">
      {/* Status Badge */}
      <span className={getStatusClasses(status)}>
        {showIcon && getStatusIcon(status)}
        <span className={showIcon ? 'ml-1' : ''}>
          {t(`inventory.${status}`)}
        </span>
      </span>

      {/* Stock Percentage (for detailed view) */}
      {size === 'lg' && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span>{percentage}% doluluk</span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${
                  warningLevel === 'critical' ? 'bg-red-500' :
                  warningLevel === 'warning' ? 'bg-orange-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
          <span className="text-xs">
            {item.current_stock.toLocaleString()} / {item.max_stock.toLocaleString()} adet
          </span>
        </div>
      )}
    </div>
  );
}
