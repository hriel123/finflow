import { lazy, Suspense, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Sidebar from './components/layout/Sidebar.jsx';
import Header from './components/layout/Header.jsx';
import LoginPage from './components/auth/LoginPage.jsx';
import { useTheme } from './hooks/useTheme.js';
import { useAuth } from './context/AuthContext.jsx';

const Dashboard = lazy(() => import('./components/dashboard/Dashboard.jsx'));
const GoalsPage = lazy(() => import('./components/goals/GoalsPage.jsx'));
const TransactionsPage = lazy(() => import('./components/transactions/TransactionsPage.jsx'));
const ReportsPage = lazy(() => import('./components/reports/ReportsPage.jsx'));
const SettingsPage = lazy(() => import('./components/settings/SettingsPage.jsx'));

function Loading() {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500 dark:text-slate-400">
      <Loader2 size={18} className="animate-spin" />
      Carregando…
    </div>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, loading, sessionError, retrySession, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loading />
      </main>
    );
  }
  if (!user && sessionError) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 p-6 space-y-4 text-center">
          <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100">Não foi possível abrir sua conta</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            O servidor não respondeu como esperado. Verifique a internet e tente de novo.
          </p>
          <button
            type="button"
            onClick={retrySession}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-3 rounded-xl shadow-sm transition-colors active:scale-[0.98]"
          >
            Tentar de novo
          </button>
          <button
            type="button"
            onClick={logout}
            className="w-full py-2.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
          >
            Sair e entrar de novo
          </button>
        </div>
      </main>
    );
  }
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
          <Suspense fallback={<Loading />}>
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
          </Suspense>
        </main>
      </div>
    </div>
  );
}
