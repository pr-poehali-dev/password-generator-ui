import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import Home from './Home';
import Generator, { PasswordOptions } from './Generator';
import History, { HistoryEntry } from './History';
import Settings from './Settings';
import OtherGenerators from './OtherGenerators';

type Page = 'home' | 'generator' | 'history' | 'other' | 'settings';

const NAV = [
  { id: 'home', label: 'Главная', icon: 'Home' },
  { id: 'generator', label: 'Пароль', icon: 'KeyRound' },
  { id: 'other', label: 'Другие', icon: 'Layers' },
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
  const { theme, toggle } = useTheme();

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
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-golos transition-colors duration-200">
      <header className="border-b border-gray-100 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-950 z-10">
        <div className="max-w-md mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('home')}
            className="font-mono font-semibold text-base tracking-tight flex items-center gap-2 text-black dark:text-white"
          >
            <Icon name="Lock" size={16} />
            PassGen
          </button>

          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={() => navigate('history')}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors rounded"
              >
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-black dark:bg-white text-white dark:text-black font-mono text-[9px] rounded-full flex items-center justify-center">
                  {history.length > 99 ? '99+' : history.length}
                </span>
                <Icon name="Clock" size={17} className="text-gray-500 dark:text-zinc-400" />
              </button>
            )}

            <button
              onClick={toggle}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors rounded"
              title={theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
            >
              <Icon
                name={theme === 'light' ? 'Moon' : 'Sun'}
                size={17}
                className="text-gray-500 dark:text-zinc-400 transition-transform duration-300"
              />
            </button>
          </div>
        </div>
      </header>

      <main className="pb-16">
        {page === 'home' && <Home onNavigate={navigate} />}
        {page === 'generator' && (
          <Generator onSave={handleSavePassword} defaultOptions={defaultOptions} />
        )}
        {page === 'other' && <OtherGenerators />}
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

      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-10 transition-colors duration-200">
        <div className="max-w-md mx-auto grid grid-cols-5">
          {NAV.map(({ id, label, icon }) => {
            const isActive = page === id;
            return (
              <button
                key={id}
                onClick={() => navigate(id)}
                className={`relative flex flex-col items-center gap-1 py-3 transition-colors ${
                  isActive
                    ? 'text-black dark:text-white'
                    : 'text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400'
                }`}
              >
                <Icon name={icon} size={18} />
                <span className="font-golos text-[10px] font-medium">{label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-black dark:bg-white" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
