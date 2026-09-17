import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar.jsx';
import Header from './components/layout/Header.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import GoalsPage from './components/goals/GoalsPage.jsx';
import TransactionsPage from './components/transactions/TransactionsPage.jsx';
import ReportsPage from './components/reports/ReportsPage.jsx';
import SettingsPage from './components/settings/SettingsPage.jsx';
import LoginPage from './components/auth/LoginPage.jsx';
import { useTheme } from './hooks/useTheme.js';
import { useAuth } from './context/AuthContext.jsx';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (loading) return null;
  if (!user) return <LoginPage />;

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        user={user}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard theme={theme} />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/reports" element={<ReportsPage theme={theme} />} />
            <Route
              path="/settings"
              element={<SettingsPage theme={theme} onToggleTheme={toggleTheme} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
