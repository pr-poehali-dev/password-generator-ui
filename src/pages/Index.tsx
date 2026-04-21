import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Home from './Home';
import Generator, { PasswordOptions } from './Generator';
import History, { HistoryEntry } from './History';
import Settings from './Settings';

type Page = 'home' | 'generator' | 'history' | 'settings';

const NAV = [
  { id: 'home', label: 'Главная', icon: 'Home' },
  { id: 'generator', label: 'Генератор', icon: 'KeyRound' },
  { id: 'history', label: 'История', icon: 'Clock' },
  { id: 'settings', label: 'Настройки', icon: 'Settings' },
] as const;

const DEFAULT_OPTIONS: PasswordOptions = {
  length: 10,
  letters: true,
  numbers: true,
  symbols: true,
};

export default function Index() {
  const [page, setPage] = useState<Page>('home');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [defaultOptions, setDefaultOptions] = useState<PasswordOptions>(DEFAULT_OPTIONS);

  const navigate = (p: string) => setPage(p as Page);

  const handleSavePassword = (password: string, options: PasswordOptions) => {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      password,
      options,
      createdAt: new Date(),
    };
    setHistory((prev) => [entry, ...prev]);
  };

  const handleDeleteEntry = (id: string) => {
    setHistory((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSaveSettings = (opts: PasswordOptions) => {
    setDefaultOptions(opts);
  };

  return (
    <div className="min-h-screen bg-white font-golos">
      <header className="border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="max-w-md mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('home')}
            className="font-mono font-semibold text-base tracking-tight flex items-center gap-2"
          >
            <Icon name="Lock" size={16} />
            PassGen
          </button>
          {history.length > 0 && (
            <button
              onClick={() => navigate('history')}
              className="relative p-2 hover:bg-gray-100 transition-colors"
            >
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-black text-white font-mono text-[9px] rounded-full flex items-center justify-center">
                {history.length > 99 ? '99+' : history.length}
              </span>
              <Icon name="Clock" size={17} className="text-gray-500" />
            </button>
          )}
        </div>
      </header>

      <main className="pb-16">
        {page === 'home' && <Home onNavigate={navigate} />}
        {page === 'generator' && (
          <Generator onSave={handleSavePassword} defaultOptions={defaultOptions} />
        )}
        {page === 'history' && (
          <History
            entries={history}
            onDelete={handleDeleteEntry}
            onClear={() => setHistory([])}
          />
        )}
        {page === 'settings' && (
          <Settings defaults={defaultOptions} onSave={handleSaveSettings} />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white z-10">
        <div className="max-w-md mx-auto grid grid-cols-4">
          {NAV.map(({ id, label, icon }) => {
            const isActive = page === id;
            return (
              <button
                key={id}
                onClick={() => navigate(id)}
                className={`relative flex flex-col items-center gap-1 py-3 transition-colors ${
                  isActive ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon name={icon} size={18} />
                <span className="font-golos text-[10px] font-medium">{label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-black" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
