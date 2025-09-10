import { Package, AlertTriangle, CheckCircle, XCircle, Search } from 'lucide-react';
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

interface InventoryTableProps {
  inventory: InventoryItem[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: 'all' | 'inStock' | 'lowStock' | 'outOfStock';
  setStatusFilter: (filter: 'all' | 'inStock' | 'lowStock' | 'outOfStock') => void;
}

export default function InventoryTable({ 
  inventory, 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter
}: InventoryTableProps) {
  const { t } = useLanguage();

  const getStockStatus = (item: InventoryItem): 'inStock' | 'lowStock' | 'outOfStock' => {
    if (item.current_stock === 0) return 'outOfStock';
    if (item.current_stock <= item.min_stock) return 'lowStock';
    return 'inStock';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'outOfStock':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'lowStock':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'inStock':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      outOfStock: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      lowStock: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      inStock: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
        {getStatusIcon(status)}
        <span className="ml-1">{t(`inventory.${status}`)}</span>
      </span>
    );
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getStockStatus(item);
    const matchesFilter = statusFilter === 'all' || status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Panel Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6" />
            {t('inventory.stockList')}
          </h2>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t('inventory.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  statusFilter === 'all'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {t('inventory.filterAll')}
              </button>
              <button
                onClick={() => setStatusFilter('inStock')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  statusFilter === 'inStock'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {t('inventory.filterInStock')}
              </button>
              <button
                onClick={() => setStatusFilter('lowStock')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  statusFilter === 'lowStock'
                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {t('inventory.filterLowStock')}
              </button>
              <button
                onClick={() => setStatusFilter('outOfStock')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  statusFilter === 'outOfStock'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {t('inventory.filterOutOfStock')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="max-h-96 overflow-y-auto">
        {filteredInventory.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('inventory.noProductsFound')}
            </h3>
            <p className="text-sm">
              {searchTerm || statusFilter !== 'all' 
                ? t('inventory.noProductsMatch')
                : t('inventory.noProductsAdded')}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredInventory.map((item) => {
              const status = getStockStatus(item);
              const isLowOrOutOfStock = status === 'lowStock' || status === 'outOfStock';
              
              return (
                <div
                  key={item.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                    isLowOrOutOfStock ? 'bg-orange-50/50 dark:bg-orange-900/10' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.product_name}
                        </h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <span>{t('inventory.current')}: <span className="font-medium">{item.current_stock.toLocaleString()}</span></span>
                        </div>
                      </div>
                      
                      {/* Stock Level Bar */}
                      <div className="hidden sm:block w-32">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              status === 'outOfStock' ? 'bg-red-500' :
                              status === 'lowStock' ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                            style={{
                              width: `${Math.max(Math.min((item.current_stock / item.max_stock) * 100, 100), item.current_stock > 0 ? 2 : 0)}%`
                            }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {((item.current_stock / item.max_stock) * 100).toFixed(1)}%
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="flex-shrink-0">
                        {getStatusBadge(status)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Footer with showing count */}
      {filteredInventory.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          {filteredInventory.length} / {inventory.length} {t('inventory.productsShowing')}
          {searchTerm && (
            <span className="ml-2">
              · "{searchTerm}" {t('inventory.searchResults')}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
