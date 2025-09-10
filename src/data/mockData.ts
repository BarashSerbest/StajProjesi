import { Order, Anomaly, Notification, DashboardStats, ChartData, AnomalyTypeData } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    date: "2025-01-02",
    customer: "Ahmet Yılmaz",
    product: "iPhone 15 Pro",
    amount: 45000,
    status: "shipped",
    anomaly: "anomaly.highCancelRate",
    severity: "medium"
  },
  {
    id: "ORD-002",
    date: "2025-01-02",
    customer: "Zeynep Kaya",
    product: "Samsung Galaxy S24",
    amount: 38000,
    status: "delivered"
  },
  {
    id: "ORD-003",
    date: "2025-01-01",
    customer: "Mehmet Özkan",
    product: "MacBook Air M3",
    amount: 55000,
    status: "pending",
    anomaly: "anomaly.stockOut",
    severity: "high"
  },
  {
    id: "ORD-004",
    date: "2025-01-01",
    customer: "Fatma Demir",
    product: "AirPods Pro",
    amount: 8500,
    status: "cancelled",
    anomaly: "anomaly.lateShipping",
    severity: "low"
  },
  {
    id: "ORD-005",
    date: "2024-12-31",
    customer: "Ali Şahin",
    product: "iPad Pro 12.9",
    amount: 42000,
    status: "shipped"
  }
];

export const mockAnomalies: Anomaly[] = [
  {
    id: "ANO-001",
    type: "anomaly.highCancelRate",
    severity: "high",
    description: "Cancel rate exceeded 15% threshold for iPhone 15 Pro",
    date: "2025-01-02",
    orderId: "ORD-001",
    suggestions: [
      "Review product descriptions for accuracy",
      "Check shipping times and costs",
      "Analyze competitor pricing"
    ]
  },
  {
    id: "ANO-002",
    type: "anomaly.stockOut",
    severity: "high",
    description: "MacBook Air M3 out of stock but still accepting orders",
    date: "2025-01-01",
    orderId: "ORD-003",
    suggestions: [
      "Update inventory system",
      "Disable product listing temporarily",
      "Contact supplier for restock timeline"
    ]
  },
  {
    id: "ANO-003",
    type: "anomaly.lateShipping",
    severity: "medium",
    description: "Shipping delay detected for electronics category",
    date: "2025-01-01",
    suggestions: [
      "Contact logistics partner",
      "Update delivery estimates",
      "Notify affected customers"
    ]
  }
];

export const mockNotifications: Notification[] = [
  {
    id: "NOT-001",
    title: "High anomaly rate detected",
    message: "Cancel rate for iPhone 15 Pro exceeded 15% in the last hour",
    type: "error",
    date: "2025-01-02T10:30:00Z",
    read: false
  },
  {
    id: "NOT-002",
    title: "Stock alert",
    message: "MacBook Air M3 inventory is running low (5 units remaining)",
    type: "warning",
    date: "2025-01-02T09:15:00Z",
    read: false
  },
  {
    id: "NOT-003",
    title: "System update completed",
    message: "Anomaly detection system has been updated successfully",
    type: "success",
    date: "2025-01-02T08:00:00Z",
    read: true
  }
];

export const mockStats: DashboardStats = {
  totalOrders: 1247,
  anomaliesDetected: 23,
  lateShipments: 8,
  cancelledOrders: 45
};

export const mockChartData: ChartData[] = [
  { date: "Dec 27", orders: 145, anomalies: 3 },
  { date: "Dec 28", orders: 178, anomalies: 5 },
  { date: "Dec 29", orders: 165, anomalies: 2 },
  { date: "Dec 30", orders: 203, anomalies: 7 },
  { date: "Dec 31", orders: 187, anomalies: 4 },
  { date: "Jan 1", orders: 234, anomalies: 8 },
  { date: "Jan 2", orders: 198, anomalies: 6 }
];

export const getMockAnomalyTypes = (t: (key: string) => string): AnomalyTypeData[] => [
  { name: t("anomaly.highCancelRate"), value: 35, color: "#EF4444" },
  { name: t("anomaly.stockOut"), value: 28, color: "#F59E0B" },
  { name: t("anomaly.lateShipping"), value: 22, color: "#F97316" },
  { name: t("anomaly.priceAnomaly"), value: 15, color: "#8B5CF6" }
];