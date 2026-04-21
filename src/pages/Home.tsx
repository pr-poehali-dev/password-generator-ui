import Icon from '@/components/ui/icon';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const features = [
  { icon: 'ShieldCheck', label: 'Безопасно', sub: 'Локальная генерация' },
  { icon: 'Zap', label: 'Быстро', sub: 'Мгновенный результат' },
  { icon: 'Sliders', label: 'Гибко', sub: 'Любые параметры' },
] as const;

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 animate-fade-in">
      <div className="max-w-md w-full text-center">
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-black dark:border-white mb-8">
            <Icon name="Lock" size={28} />
          </div>
          <h1 className="font-mono text-4xl font-semibold tracking-tight mb-4">PassGen</h1>
          <p className="font-golos text-gray-500 dark:text-zinc-400 text-lg leading-relaxed">
            Генерируйте надёжные пароли.<br />Храните историю. Настраивайте под себя.
          </p>
        </div>

        <div className="space-y-3 mb-12">
          <button
            onClick={() => onNavigate('generator')}
            className="w-full bg-black dark:bg-white text-white dark:text-black font-golos font-medium py-4 px-6 flex items-center justify-between group transition-all hover:bg-gray-900 dark:hover:bg-zinc-200"
          >
            <span>Создать пароль</span>
            <Icon name="ArrowRight" size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('history')}
              className="border border-gray-200 dark:border-zinc-700 font-golos font-medium py-4 px-6 flex items-center justify-center gap-2 hover:border-black dark:hover:border-white transition-colors"
            >
              <Icon name="Clock" size={16} />
              <span>История</span>
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="border border-gray-200 dark:border-zinc-700 font-golos font-medium py-4 px-6 flex items-center justify-center gap-2 hover:border-black dark:hover:border-white transition-colors"
            >
              <Icon name="Settings" size={16} />
              <span>Настройки</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 border-t border-gray-100 dark:border-zinc-800 pt-10">
          {features.map((item) => (
            <div key={item.label} className="text-center">
              <Icon name={item.icon} size={20} className="mx-auto mb-2 text-gray-400 dark:text-zinc-500" />
              <div className="font-golos font-medium text-sm">{item.label}</div>
              <div className="font-golos text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
