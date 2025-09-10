import { useState, useEffect } from 'react';
import { Package, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import InventoryStats from '../components/Inventory/InventoryStats';
import InventoryTable from '../components/Inventory/InventoryTable';

interface InventoryItem {
  id: number;
  product_name: string;
  current_stock: number;
  max_stock: number;
  min_stock: number;
  created_at: string;
  updated_at: string;
}

export default function Inventory() {
  const { t } = useLanguage();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'inStock' | 'lowStock' | 'outOfStock'>('all');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/inventory');
      
      if (response.ok) {
        const data = await response.json();
        setInventory(data);
        setError(null);
      } else {
        setError(`API Error: ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('inventory.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('inventory.subtitle')}
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Başlık */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Package className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('inventory.title')}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {t('inventory.subtitle')}
        </p>
      </div>

      {/* Hata Mesajı */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <div className="flex">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <div>
              <p className="font-medium">Hata:</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* İstatistik Kartları */}
      <div className="mb-8">
        <InventoryStats inventory={inventory} />
      </div>

      {/* Envanter Tablosu */}
      <InventoryTable 
        inventory={inventory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
    </div>
  );
}