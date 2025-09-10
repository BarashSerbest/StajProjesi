import { Package, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
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

interface InventoryStatsProps {
  inventory: InventoryItem[];
}

export default function InventoryStats({ inventory }: InventoryStatsProps) {
  const { t } = useLanguage();
  
  const getStockStatus = (item: InventoryItem): 'inStock' | 'lowStock' | 'outOfStock' => {
    if (item.current_stock === 0) return 'outOfStock';
    if (item.current_stock <= item.min_stock) return 'lowStock';
    return 'inStock';
  };

  const stockStats = {
    total: inventory.length,
    inStock: inventory.filter(item => getStockStatus(item) === 'inStock').length,
    lowStock: inventory.filter(item => getStockStatus(item) === 'lowStock').length,
    outOfStock: inventory.filter(item => getStockStatus(item) === 'outOfStock').length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Total Products */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Package className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('inventory.totalProducts')}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stockStats.total}</p>
          </div>
        </div>
      </div>

      {/* In Stock */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('inventory.inStock')}</h3>
            <p className="text-2xl font-bold text-green-600">{stockStats.inStock}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {stockStats.total > 0 ? Math.round((stockStats.inStock / stockStats.total) * 100) : 0}% {t('inventory.ofTotal')}
            </p>
          </div>
        </div>
      </div>

      {/* Low Stock */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('inventory.lowStock')}</h3>
            <p className="text-2xl font-bold text-orange-600">{stockStats.lowStock}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('inventory.needsReplenishment')}
            </p>
          </div>
        </div>
      </div>

      {/* Out of Stock */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('inventory.outOfStock')}</h3>
            <p className="text-2xl font-bold text-red-600">{stockStats.outOfStock}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('inventory.criticalStatus')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
