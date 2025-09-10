import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import OrderList from './pages/OrderList';
import Anomalies from './pages/Anomalies';
import Notifications from './pages/Notifications';
import Inventory from './pages/Inventory';
import Settings from './pages/Settings';
import Auth from './pages/Auth';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();

  // If not authenticated, show Auth page
  if (!isAuthenticated) {
    return <Auth />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <OrderList />;
      case 'anomalies':
        return <Anomalies />;
      case 'notifications':
        return <Notifications />;
      case 'inventory':
        return <Inventory />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <div className="flex">
        <Sidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-0' : 'ml-0'
        }`}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;