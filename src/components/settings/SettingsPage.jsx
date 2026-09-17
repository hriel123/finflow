import { useState } from 'react';
import { User, Tag, SlidersHorizontal } from 'lucide-react';
import ProfileTab from './ProfileTab.jsx';
import CategoriesTab from './CategoriesTab.jsx';
import PreferencesTab from './PreferencesTab.jsx';

const TABS = [
  { key: 'profile', label: 'Perfil', icon: User },
  { key: 'categories', label: 'Categorias', icon: Tag },
  { key: 'preferences', label: 'Preferências', icon: SlidersHorizontal },
];

export default function SettingsPage({ theme, onToggleTheme }) {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Configurações</h1>
        <p className="text-sm text-slate-400">Gerencie seu perfil, categorias e preferências.</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === key
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && <ProfileTab />}
      {activeTab === 'categories' && <CategoriesTab />}
      {activeTab === 'preferences' && <PreferencesTab theme={theme} onToggleTheme={onToggleTheme} />}
    </div>
  );
}
