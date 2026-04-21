import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { PasswordOptions } from './Generator';

interface SettingsProps {
  defaults: PasswordOptions;
  onSave: (opts: PasswordOptions) => void;
}

export default function Settings({ defaults, onSave }: SettingsProps) {
  const [opts, setOpts] = useState<PasswordOptions>(defaults);
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) => {
    setOpts((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    onSave(opts);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-10 animate-fade-in">
      <h2 className="font-golos text-2xl font-semibold mb-8">Настройки</h2>

      <div className="space-y-8">
        <section>
          <h3 className="font-golos font-medium text-xs uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-4">
            По умолчанию
          </h3>

          <div className="space-y-4">
            <div className="border border-gray-100 dark:border-zinc-800 p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-golos font-medium text-sm">Длина пароля</span>
                <span className="font-mono text-sm font-semibold">{opts.length}</span>
              </div>
              <input
                type="range"
                min={6}
                max={32}
                value={opts.length}
                onChange={(e) => update('length', Number(e.target.value))}
                className="w-full h-px bg-gray-200 dark:bg-zinc-700 appearance-none cursor-pointer accent-black dark:accent-white"
              />
              <div className="flex justify-between mt-1">
                <span className="font-golos text-xs text-gray-300 dark:text-zinc-600">6</span>
                <span className="font-golos text-xs text-gray-300 dark:text-zinc-600">32</span>
              </div>
            </div>

            {[
              { key: 'letters' as const, label: 'Включать буквы', desc: 'Латинские a–z, A–Z' },
              { key: 'numbers' as const, label: 'Включать цифры', desc: 'Числа 0–9' },
              { key: 'symbols' as const, label: 'Включать символы', desc: 'Специальные !@#$%' },
            ].map(({ key, label, desc }) => (
              <div
                key={key}
                className="border border-gray-100 dark:border-zinc-800 p-4 flex items-center justify-between cursor-pointer hover:border-gray-300 dark:hover:border-zinc-600 transition-colors"
                onClick={() => update(key, !opts[key])}
              >
                <div>
                  <div className="font-golos font-medium text-sm">{label}</div>
                  <div className="font-golos text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{desc}</div>
                </div>
                <div className={`w-9 h-5 rounded-full transition-colors relative ${opts[key] ? 'bg-black dark:bg-white' : 'bg-gray-200 dark:bg-zinc-700'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all shadow-sm ${opts[key] ? 'left-4 bg-white dark:bg-black' : 'left-0.5 bg-white dark:bg-zinc-400'}`} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-golos font-medium text-xs uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-4">
            Предпросмотр
          </h3>
          <div className="border border-dashed border-gray-200 dark:border-zinc-700 p-4 text-center">
            <span className="font-golos text-xs text-gray-400 dark:text-zinc-500">
              Длина: {opts.length} ·{' '}
              {[opts.letters && 'буквы', opts.numbers && 'цифры', opts.symbols && 'символы']
                .filter(Boolean)
                .join(', ') || 'ничего не выбрано'}
            </span>
          </div>
        </section>

        <button
          onClick={handleSave}
          className={`w-full font-golos font-medium py-3.5 flex items-center justify-center gap-2 transition-all ${
            saved ? 'bg-green-500 text-white' : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-zinc-200'
          }`}
        >
          <Icon name={saved ? 'Check' : 'Save'} size={15} />
          {saved ? 'Настройки сохранены' : 'Сохранить настройки'}
        </button>
      </div>
    </div>
  );
}
