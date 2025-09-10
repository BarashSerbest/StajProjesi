import { useState, useEffect } from 'react';
import { X, Package, Save } from 'lucide-react';
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

interface EditStockModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: number, newStock: number) => Promise<void>;
}

export default function EditStockModal({ item, isOpen, onClose, onUpdate }: EditStockModalProps) {
  const { t } = useLanguage();
  const [currentStock, setCurrentStock] = useState<number>(item?.current_stock || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update state when item changes
  useEffect(() => {
    if (item) {
      setCurrentStock(item.current_stock);
      setError(null);
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    if (currentStock < 0) {
      setError('Stok miktarı negatif olamaz');
      return;
    }

    if (currentStock > item.max_stock) {
      setError(`Maksimum stok miktarı ${item.max_stock} adetdir`);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await onUpdate(item.id, currentStock);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Stok güncellenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!isOpen || !item) return null;

  const getStockStatus = () => {
    if (currentStock === 0) return { status: 'Stok Yok', color: 'text-red-600' };
    if (currentStock <= item.min_stock) return { status: 'Düşük Stok', color: 'text-orange-600' };
    return { status: 'Stokta', color: 'text-green-600' };
  };

  const statusInfo = getStockStatus();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Package className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('inventory.editStock')}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Product Info */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {item.product_name}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <span className="font-medium">Min Stok:</span> {item.min_stock.toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Maks Stok:</span> {item.max_stock.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Current Stock Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('inventory.currentStockLevel')}
            </label>
            <input
              type="number"
              min="0"
              max={item.max_stock}
              value={currentStock}
              onChange={(e) => setCurrentStock(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {/* Stock Status Preview */}
          <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Yeni Durum:</span>
              <span className={`font-medium ${statusInfo.color}`}>
                {statusInfo.status}
              </span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    currentStock === 0 ? 'bg-red-500' :
                    currentStock <= item.min_stock ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                  style={{
                    width: `${Math.min((currentStock / item.max_stock) * 100, 100)}%`
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {Math.round((currentStock / item.max_stock) * 100)}% kapasiteden
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              disabled={isLoading}
            >
              {t('inventory.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t('inventory.updateStock')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
