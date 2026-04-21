import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { PasswordOptions } from './Generator';

export interface HistoryEntry {
  id: string;
  password: string;
  options: PasswordOptions;
  createdAt: Date;
}

interface HistoryProps {
  entries: HistoryEntry[];
  onDelete: (id: string) => void;
  onClear: () => void;
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return 'только что';
  if (minutes < 60) return `${minutes} мин назад`;
  if (hours < 24) return `${hours} ч назад`;
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function optionsTags(opts: PasswordOptions): string[] {
  const tags = [];
  if (opts.letters) tags.push('Буквы');
  if (opts.numbers) tags.push('Цифры');
  if (opts.symbols) tags.push('Символы');
  return tags;
}

export default function History({ entries, onDelete, onClear }: HistoryProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (id: string, password: string) => {
    await navigator.clipboard.writeText(password);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-golos text-2xl font-semibold">История</h2>
        {entries.length > 0 && (
          <button
            onClick={onClear}
            className="font-golos text-sm text-gray-400 hover:text-black transition-colors flex items-center gap-1.5"
          >
            <Icon name="Trash2" size={14} />
            Очистить
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-12 h-12 border border-gray-200 mb-4">
            <Icon name="Clock" size={20} className="text-gray-300" />
          </div>
          <p className="font-golos text-gray-400 text-sm">История пуста</p>
          <p className="font-golos text-gray-300 text-xs mt-1">Сохранённые пароли появятся здесь</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="border border-gray-100 p-4 hover:border-gray-300 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm font-medium tracking-wide truncate mb-2">
                    {entry.password}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-golos text-xs text-gray-400">
                      {formatDate(entry.createdAt)}
                    </span>
                    <span className="font-golos text-xs text-gray-300">·</span>
                    <span className="font-golos text-xs text-gray-400">
                      {entry.options.length} симв.
                    </span>
                    {optionsTags(entry.options).map((tag) => (
                      <span
                        key={tag}
                        className="font-golos text-xs bg-gray-50 text-gray-500 px-1.5 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopy(entry.id, entry.password)}
                    className="p-1.5 hover:bg-gray-100 transition-colors"
                    title="Копировать"
                  >
                    <Icon name={copied === entry.id ? 'Check' : 'Copy'} size={14} className={copied === entry.id ? 'text-green-500' : 'text-gray-400'} />
                  </button>
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="p-1.5 hover:bg-gray-100 transition-colors"
                    title="Удалить"
                  >
                    <Icon name="X" size={14} className="text-gray-400 hover:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
