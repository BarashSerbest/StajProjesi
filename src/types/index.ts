export interface Order {
  id: string;
  date: string;
  customer: string;
  product: string;
  amount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  anomaly?: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface Anomaly {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  date: string;
  orderId?: string;
  suggestions: string[];
  cancel_rate_threshold?: number;
  late_shipping_threshold?: number;
  stock_out_threshold?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  date: string;
  read: boolean;
}

export interface DashboardStats {
  totalOrders: number;
  anomaliesDetected: number;
  lateShipments: number;
  cancelledOrders: number;
}

export interface ChartData {
  date: string;
  orders: number;
  anomalies: number;
}

export interface AnomalyTypeData {
  name: string;
  value: number;
  color: string;
}

export interface InventoryItem {
  id: number;
  product_name: string;
  current_stock: number;
  max_stock: number;
  min_stock: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryUpdate {
  current_stock: number;
  min_stock: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  last_login?: string;
}