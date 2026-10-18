import { useLocation } from 'react-router-dom';
import { Menu, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const PAGE_INFO = {
  '/': {
    title: 'Dashboard',
    subtitle: 'Acompanhe sua vida financeira em um só lugar',
  },
  '/transactions': {
    title: 'Transações',
    subtitle: 'Veja, edite e organize todos os seus lançamentos',
  },
  '/goals': {
    title: 'Metas',
    subtitle: 'Defina e acompanhe seus objetivos financeiros',
  },
  '/reports': {
    title: 'Relatórios',
    subtitle: 'Analise sua evolução financeira em detalhe',
  },
  '/settings': {
    title: 'Configurações',
    subtitle: 'Gerencie seu perfil, categorias e preferências',
  },
};

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation();
  const { title, subtitle } = PAGE_INFO[pathname] ?? PAGE_INFO['/'];
  const { isDemo, logout } = useAuth();

  function createAccount() {
    window.history.replaceState(null, '', '/?criar=1');
    logout();
  }

  return (
    <>
    {isDemo && (
      <div className="bg-primary-600 text-white text-xs sm:text-sm px-4 sm:px-6 py-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles size={14} />
          Modo demonstração: dados de exemplo, salvos só neste navegador.
        </span>
        <button
          type="button"
          onClick={createAccount}
          className="font-semibold underline underline-offset-2 hover:text-primary-100"
        >
          Criar minha conta
        </button>
      </div>
    )}
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 rounded-lg"
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
          <p className="text-xs text-slate-400 hidden sm:block">{subtitle}</p>
        </div>
      </div>
    </header>
    </>
  );
}
