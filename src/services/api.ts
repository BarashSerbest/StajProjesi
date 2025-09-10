import axios from 'axios';
import { Order, Anomaly, Notification, DashboardStats, ChartData, AnomalyTypeData, InventoryItem, InventoryUpdate } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Orders
  async getOrders(filters?: {
    status?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
  }): Promise<Order[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters?.date_from) params.append('date_from', filters.date_from);
      if (filters?.date_to) params.append('date_to', filters.date_to);
      if (filters?.search) params.append('search', filters.search);
      
      console.log('Fetching orders with params:', params.toString());
      const response = await api.get(`/orders?${params.toString()}`);
      console.log('Orders response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Anomalies
  async getAnomalies(): Promise<Anomaly[]> {
    try {
      console.log('Fetching anomalies...');
      const response = await api.get('/anomalies');
      console.log('Anomalies response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching anomalies:', error);
      throw error;
    }
  },

  async getFilteredAnomalies(thresholds?: {
    cancel_rate_threshold?: number;
    late_shipping_threshold?: number;
    stock_out_threshold?: number;
  }): Promise<Anomaly[]> {
    try {
      console.log('Fetching filtered anomalies with thresholds:', thresholds);
      const params = new URLSearchParams();
      if (thresholds?.cancel_rate_threshold !== undefined) {
        params.append('cancel_rate_threshold', thresholds.cancel_rate_threshold.toString());
      }
      if (thresholds?.late_shipping_threshold !== undefined) {
        params.append('late_shipping_threshold', thresholds.late_shipping_threshold.toString());
      }
      if (thresholds?.stock_out_threshold !== undefined) {
        params.append('stock_out_threshold', thresholds.stock_out_threshold.toString());
      }
      
      const response = await api.get(`/anomalies/filtered?${params.toString()}`);
      console.log('Filtered anomalies response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching filtered anomalies:', error);
      throw error;
    }
  },

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    try {
      console.log('Fetching notifications...');
      const response = await api.get('/notifications');
      console.log('Notifications response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  async markNotificationAsRead(id: string): Promise<void> {
    await api.put(`/notifications/${id}/read`);
  },

  async deleteNotification(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  },

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      console.log('Fetching dashboard stats...');
      const response = await api.get('/dashboard/stats');
      console.log('Dashboard stats response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  async getChartData(): Promise<ChartData[]> {
    try {
      console.log('Fetching chart data...');
      const response = await api.get('/dashboard/chart-data');
      console.log('Chart data response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching chart data:', error);
      throw error;
    }
  },

  async getAnomalyTypes(): Promise<AnomalyTypeData[]> {
    try {
      console.log('Fetching anomaly types...');
      const response = await api.get('/dashboard/anomaly-types');
      console.log('Anomaly types response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching anomaly types:', error);
      throw error;
    }
  },

  // Settings
  async getSettings(): Promise<any> {
    try {
      console.log('Fetching settings...');
      const response = await api.get('/settings');
      console.log('Settings response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  async updateSettings(settings: any): Promise<void> {
    try {
      console.log('Updating settings:', settings);
      await api.post('/settings', settings);
      console.log('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  // Anomaly Detection
  async triggerAnomalyDetection(): Promise<any> {
    try {
      console.log('Triggering anomaly detection...');
      const response = await api.post('/anomalies/detect');
      console.log('Anomaly detection response:', response);
      return response.data;
    } catch (error) {
      console.error('Error triggering anomaly detection:', error);
      throw error;
    }
  },

  // Inventory
  async getInventory(): Promise<InventoryItem[]> {
    try {
      console.log('Fetching inventory...');
      const response = await api.get('/inventory');
      console.log('Inventory response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw error;
    }
  },

  async getInventoryItem(productName: string): Promise<InventoryItem> {
    try {
      console.log('Fetching inventory item:', productName);
      const response = await api.get(`/inventory/${encodeURIComponent(productName)}`);
      console.log('Inventory item response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory item:', error);
      throw error;
    }
  },

  async updateInventoryItem(productName: string, update: InventoryUpdate): Promise<void> {
    try {
      console.log('Updating inventory item:', productName, update);
      await api.put(`/inventory/${encodeURIComponent(productName)}`, update);
      console.log('Inventory item updated successfully');
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
  },

  async getLowStockItems(): Promise<InventoryItem[]> {
    try {
      console.log('Fetching low stock items...');
      const response = await api.get('/inventory/low-stock');
      console.log('Low stock items response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      throw error;
    }
  },

  // User Authentication
  async registerUser(userData: { username: string; email: string; password: string }) {
    try {
      console.log('Registering user...');
      const response = await api.post('/auth/register', userData);
      console.log('Register response:', response);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  async loginUser(loginData: { email: string; password: string }) {
    try {
      console.log('Logging in user...');
      const response = await api.post('/auth/login', loginData);
      console.log('Login response:', response);
      return response.data;
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  },

  async forgotPassword(email: string) {
    try {
      console.log('Sending forgot password request...');
      const response = await api.post('/auth/forgot-password', { email });
      console.log('Forgot password response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in forgot password:', error);
      throw error;
    }
  },

  async getCurrentUser(email: string) {
    try {
      console.log('Fetching current user...');
      const response = await api.get(`/users/me?email=${email}`);
      console.log('Current user response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },
};