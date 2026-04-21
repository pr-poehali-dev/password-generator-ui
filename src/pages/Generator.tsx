import { useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';

interface GeneratorProps {
  onSave: (password: string, options: PasswordOptions) => void;
  defaultOptions?: PasswordOptions;
}

export interface PasswordOptions {
  length: number;
  letters: boolean;
  numbers: boolean;
  symbols: boolean;
}

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function generatePassword(opts: PasswordOptions): string {
  let charset = '';
  if (opts.letters) charset += CHARS.upper + CHARS.lower;
  if (opts.numbers) charset += CHARS.numbers;
  if (opts.symbols) charset += CHARS.symbols;
  if (!charset) charset = CHARS.lower;

  let password = '';
  for (let i = 0; i < opts.length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  return password;
}

function getStrength(password: string): { level: number; label: string; color: string } {
  if (!password) return { level: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { level: score, label: 'Слабый', color: 'bg-red-400' };
  if (score <= 3) return { level: score, label: 'Средний', color: 'bg-yellow-400' };
  return { level: score, label: 'Надёжный', color: 'bg-green-500' };
}

export default function Generator({ onSave, defaultOptions }: GeneratorProps) {
  const [options, setOptions] = useState<PasswordOptions>(defaultOptions ?? {
    length: 10, letters: true, numbers: true, symbols: true,
  });

  const [password, setPassword] = useState(() => generatePassword(defaultOptions ?? {
    length: 10, letters: true, numbers: true, symbols: true,
  }));
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const generate = useCallback((opts = options) => {
    setPassword(generatePassword(opts));
    setCopied(false);
    setSaved(false);
  }, [options]);

  const updateOption = <K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) => {
    const newOpts = { ...options, [key]: value };
    setOptions(newOpts);
    generate(newOpts);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSave(password, options);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const strength = getStrength(password);

  return (
    <div className="max-w-md mx-auto px-6 py-10 animate-fade-in">
      <h2 className="font-golos text-2xl font-semibold mb-8">Генератор</h2>

      <div className="border border-gray-200 dark:border-zinc-700 p-6 mb-6 relative group">
        <div className="font-mono text-xl font-medium tracking-wider break-all leading-relaxed pr-10 min-h-[3rem] flex items-center">
          {password}
        </div>
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          title="Копировать"
        >
          <Icon name={copied ? 'Check' : 'Copy'} size={18} />
        </button>

        {password && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-golos text-xs text-gray-400 dark:text-zinc-500">Надёжность</span>
              <span className="font-golos text-xs font-medium">{strength.label}</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 transition-all duration-300 ${i <= strength.level ? strength.color : 'bg-gray-100 dark:bg-zinc-800'}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-5 mb-8">
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="font-golos font-medium text-sm">Длина пароля</span>
            <span className="font-mono text-sm font-medium">{options.length}</span>
          </div>
          <input
            type="range"
            min={6}
            max={32}
            value={options.length}
            onChange={(e) => updateOption('length', Number(e.target.value))}
            className="w-full h-px bg-gray-200 dark:bg-zinc-700 appearance-none cursor-pointer accent-black dark:accent-white"
          />
          <div className="flex justify-between mt-1">
            <span className="font-golos text-xs text-gray-400 dark:text-zinc-600">6</span>
            <span className="font-golos text-xs text-gray-400 dark:text-zinc-600">32</span>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { key: 'letters' as const, label: 'Буквы', example: 'Aa–Zz' },
            { key: 'numbers' as const, label: 'Цифры', example: '0–9' },
            { key: 'symbols' as const, label: 'Спецсимволы', example: '!@#$' },
          ].map(({ key, label, example }) => (
            <button
              key={key}
              onClick={() => updateOption(key, !options[key])}
              className={`w-full flex items-center justify-between py-3 px-4 border transition-all ${
                options[key]
                  ? 'border-black dark:border-white'
                  : 'border-gray-200 dark:border-zinc-700 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 border flex items-center justify-center transition-all ${
                  options[key]
                    ? 'border-black dark:border-white bg-black dark:bg-white'
                    : 'border-gray-300 dark:border-zinc-600'
                }`}>
                  {options[key] && <Icon name="Check" size={10} className="text-white dark:text-black" />}
                </div>
                <span className="font-golos font-medium text-sm">{label}</span>
              </div>
              <span className="font-mono text-xs text-gray-400 dark:text-zinc-500">{example}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => generate()}
          className="border border-black dark:border-white font-golos font-medium py-3 px-4 flex items-center justify-center gap-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
        >
          <Icon name="RefreshCw" size={15} />
          Обновить
        </button>
        <button
          onClick={handleSave}
          className={`font-golos font-medium py-3 px-4 flex items-center justify-center gap-2 transition-all ${
            saved ? 'bg-green-500 text-white' : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-zinc-200'
          }`}
        >
          <Icon name={saved ? 'Check' : 'Bookmark'} size={15} />
          {saved ? 'Сохранено' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
}
