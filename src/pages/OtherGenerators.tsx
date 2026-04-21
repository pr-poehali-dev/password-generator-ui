import { useState } from 'react';
import Icon from '@/components/ui/icon';

const MALE_NAMES = ['Александр', 'Дмитрий', 'Максим', 'Сергей', 'Андрей', 'Алексей', 'Артём', 'Илья', 'Кирилл', 'Михаил', 'Никита', 'Роман', 'Егор', 'Тимур', 'Владимир', 'Иван', 'Павел', 'Антон', 'Даниил', 'Евгений'];
const FEMALE_NAMES = ['Анастасия', 'Екатерина', 'Мария', 'Анна', 'Виктория', 'Полина', 'Дарья', 'Ольга', 'Алина', 'Юлия', 'Елена', 'Валерия', 'Ксения', 'Надежда', 'Татьяна', 'Наталья', 'Ирина', 'Светлана', 'Вера', 'Диана'];
const SURNAMES = ['Иванов', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Петров', 'Соколов', 'Михайлов', 'Новиков', 'Фёдоров', 'Морозов', 'Волков', 'Алексеев', 'Лебедев', 'Семёнов', 'Егоров', 'Павлов', 'Козлов', 'Степанов', 'Николаев'];

const CAT_NAMES_ANY = ['Мурзик', 'Барсик', 'Рыжик', 'Персик', 'Тигр', 'Лунтик', 'Пушок', 'Снежок', 'Уголёк', 'Дымок', 'Граф', 'Лорд', 'Арчи', 'Зефир', 'Печенька', 'Нуар', 'Хаос', 'Бублик', 'Крем', 'Фантик', 'Марс', 'Зефирка', 'Кекс', 'Пончик', 'Тофу'];
const CAT_NAMES_MALE = ['Барсик', 'Мурзик', 'Рыжик', 'Тигр', 'Граф', 'Лорд', 'Арчи', 'Дымок', 'Уголёк', 'Снежок', 'Пушок', 'Нуар', 'Хаос', 'Марс', 'Зефир', 'Бублик', 'Кекс', 'Пончик', 'Феликс', 'Оскар', 'Гермес', 'Зевс', 'Лео', 'Макс', 'Принц'];
const CAT_NAMES_FEMALE = ['Мурка', 'Ласка', 'Персик', 'Пуговка', 'Снежинка', 'Звёздочка', 'Лапочка', 'Розочка', 'Малышка', 'Крошка', 'Дымка', 'Луна', 'Соня', 'Феня', 'Ириска', 'Карамелька', 'Зефирка', 'Печенька', 'Vanilla', 'Пушинка', 'Искра', 'Нимфа', 'Белка', 'Жемчужина', 'Нала'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateName(gender: 'male' | 'female' | 'any'): string {
  const isMale = gender === 'any' ? Math.random() > 0.5 : gender === 'male';
  const name = pick(isMale ? MALE_NAMES : FEMALE_NAMES);
  const surname = pick(SURNAMES) + (isMale ? '' : 'а');
  return `${name} ${surname}`;
}

function generateCatName(gender: 'male' | 'female' | 'any'): string {
  if (gender === 'male') return pick(CAT_NAMES_MALE);
  if (gender === 'female') return pick(CAT_NAMES_FEMALE);
  return pick(CAT_NAMES_ANY);
}

function generateNumber(min: number, max: number): string {
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

type Tab = 'names' | 'numbers' | 'cats';
type Gender = 'any' | 'male' | 'female';

export default function OtherGenerators() {
  const [tab, setTab] = useState<Tab>('names');

  const [gender, setGender] = useState<Gender>('any');
  const [nameCount, setNameCount] = useState(5);
  const [names, setNames] = useState<string[]>(() =>
    Array.from({ length: 5 }, () => generateName('any'))
  );
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const [numMin, setNumMin] = useState(1);
  const [numMax, setNumMax] = useState(100);
  const [numCount, setNumCount] = useState(5);
  const [numbers, setNumbers] = useState<string[]>(() =>
    Array.from({ length: 5 }, () => generateNumber(1, 100))
  );
  const [copiedNum, setCopiedNum] = useState<string | null>(null);

  const [catGender, setCatGender] = useState<Gender>('any');
  const [catCount, setCatCount] = useState(5);
  const [cats, setCats] = useState<string[]>(() =>
    Array.from({ length: 5 }, () => generateCatName('any'))
  );
  const [copiedCat, setCopiedCat] = useState<string | null>(null);

  const handleGenerateNames = () => {
    setNames(Array.from({ length: nameCount }, () => generateName(gender)));
  };

  const handleGenerateNumbers = () => {
    const mn = Math.min(numMin, numMax);
    const mx = Math.max(numMin, numMax);
    setNumbers(Array.from({ length: numCount }, () => generateNumber(mn, mx)));
  };

  const handleGenerateCats = () => {
    setCats(Array.from({ length: catCount }, () => generateCatName(catGender)));
  };

  const copyItem = async (value: string, type: 'name' | 'num' | 'cat') => {
    await navigator.clipboard.writeText(value);
    if (type === 'name') { setCopiedName(value); setTimeout(() => setCopiedName(null), 1500); }
    else if (type === 'num') { setCopiedNum(value); setTimeout(() => setCopiedNum(null), 1500); }
    else { setCopiedCat(value); setTimeout(() => setCopiedCat(null), 1500); }
  };

  const copyAll = async (items: string[]) => {
    await navigator.clipboard.writeText(items.join('\n'));
  };

  const TABS = [
    ['names', 'Имена', 'User'],
    ['numbers', 'Числа', 'Hash'],
    ['cats', 'Кошки', 'Cat'],
  ] as const;

  return (
    <div className="max-w-md mx-auto px-6 py-10 animate-fade-in">
      <h2 className="font-golos text-2xl font-semibold mb-6">Другие генераторы</h2>

      <div className="flex border-b border-gray-100 dark:border-zinc-800 mb-8">
        {TABS.map(([id, label, icon]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 font-golos font-medium text-sm border-b-2 transition-colors -mb-px ${
              tab === id
                ? 'border-black dark:border-white text-black dark:text-white'
                : 'border-transparent text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <Icon name={icon} size={14} fallback="Star" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'names' && (
        <div className="space-y-5 animate-fade-in">
          <div className="space-y-3">
            <div>
              <label className="font-golos text-xs uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-2 block">Пол</label>
              <div className="grid grid-cols-3 gap-2">
                {([['any', 'Любой'], ['male', 'Мужской'], ['female', 'Женский']] as const).map(([val, lbl]) => (
                  <button key={val} onClick={() => setGender(val)}
                    className={`py-2 font-golos text-sm font-medium border transition-all ${gender === val ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black' : 'border-gray-200 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500'}`}
                  >{lbl}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-golos text-xs uppercase tracking-widest text-gray-400 dark:text-zinc-500">Количество</label>
                <span className="font-mono text-xs font-medium">{nameCount}</span>
              </div>
              <input type="range" min={1} max={20} value={nameCount} onChange={(e) => setNameCount(Number(e.target.value))} className="w-full h-px bg-gray-200 dark:bg-zinc-700 appearance-none cursor-pointer accent-black dark:accent-white" />
              <div className="flex justify-between mt-1">
                <span className="font-golos text-xs text-gray-300 dark:text-zinc-600">1</span>
                <span className="font-golos text-xs text-gray-300 dark:text-zinc-600">20</span>
              </div>
            </div>
          </div>
          <button onClick={handleGenerateNames} className="w-full bg-black dark:bg-white text-white dark:text-black font-golos font-medium py-3 flex items-center justify-center gap-2 hover:bg-gray-900 dark:hover:bg-zinc-200 transition-all">
            <Icon name="Sparkles" size={15} />Сгенерировать
          </button>
          {names.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-golos text-xs text-gray-400 dark:text-zinc-500">{names.length} имён</span>
                <button onClick={() => copyAll(names)} className="font-golos text-xs text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
                  <Icon name="Copy" size={12} />Копировать все
                </button>
              </div>
              <div className="space-y-1">
                {names.map((name, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 px-3 border border-gray-100 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-600 group transition-colors">
                    <span className="font-golos text-sm font-medium">{name}</span>
                    <button onClick={() => copyItem(name, 'name')} className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon name={copiedName === name ? 'Check' : 'Copy'} size={13} className={copiedName === name ? 'text-green-500' : 'text-gray-400 dark:text-zinc-500'} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'numbers' && (
        <div className="space-y-5 animate-fade-in">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-golos text-xs uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-2 block">От</label>
                <input type="number" value={numMin} onChange={(e) => setNumMin(Number(e.target.value))} className="w-full border border-gray-200 dark:border-zinc-700 bg-transparent font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-black dark:focus:border-white transition-colors" />
              </div>
              <div>
                <label className="font-golos text-xs uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-2 block">До</label>
                <input type="number" value={numMax} onChange={(e) => setNumMax(Number(e.target.value))} className="w-full border border-gray-200 dark:border-zinc-700 bg-transparent font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-black dark:focus:border-white transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-golos text-xs uppercase tracking-widest text-gray-400 dark:text-zinc-500">Количество</label>
                <span className="font-mono text-xs font-medium">{numCount}</span>
              </div>
              <input type="range" min={1} max={20} value={numCount} onChange={(e) => setNumCount(Number(e.target.value))} className="w-full h-px bg-gray-200 dark:bg-zinc-700 appearance-none cursor-pointer accent-black dark:accent-white" />
              <div className="flex justify-between mt-1">
                <span className="font-golos text-xs text-gray-300 dark:text-zinc-600">1</span>
                <span className="font-golos text-xs text-gray-300 dark:text-zinc-600">20</span>
              </div>
            </div>
          </div>
          <button onClick={handleGenerateNumbers} className="w-full bg-black dark:bg-white text-white dark:text-black font-golos font-medium py-3 flex items-center justify-center gap-2 hover:bg-gray-900 dark:hover:bg-zinc-200 transition-all">
            <Icon name="Sparkles" size={15} />Сгенерировать
          </button>
          {numbers.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-golos text-xs text-gray-400 dark:text-zinc-500">{numbers.length} чисел</span>
                <button onClick={() => copyAll(numbers)} className="font-golos text-xs text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
                  <Icon name="Copy" size={12} />Копировать все
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {numbers.map((num, i) => (
                  <button key={i} onClick={() => copyItem(num, 'num')}
                    className={`font-mono text-base font-semibold py-3 border transition-all ${copiedNum === num ? 'border-green-400 text-green-500' : 'border-gray-100 dark:border-zinc-800 hover:border-black dark:hover:border-white'}`}
                  >{num}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'cats' && (
        <div className="space-y-5 animate-fade-in">
          <div className="space-y-3">
            <div>
              <label className="font-golos text-xs uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-2 block">Пол кошки</label>
              <div className="grid grid-cols-3 gap-2">
                {([['any', 'Любой'], ['male', 'Кот'], ['female', 'Кошка']] as const).map(([val, lbl]) => (
                  <button key={val} onClick={() => setCatGender(val)}
                    className={`py-2 font-golos text-sm font-medium border transition-all ${catGender === val ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black' : 'border-gray-200 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500'}`}
                  >{lbl}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-golos text-xs uppercase tracking-widest text-gray-400 dark:text-zinc-500">Количество</label>
                <span className="font-mono text-xs font-medium">{catCount}</span>
              </div>
              <input type="range" min={1} max={20} value={catCount} onChange={(e) => setCatCount(Number(e.target.value))} className="w-full h-px bg-gray-200 dark:bg-zinc-700 appearance-none cursor-pointer accent-black dark:accent-white" />
              <div className="flex justify-between mt-1">
                <span className="font-golos text-xs text-gray-300 dark:text-zinc-600">1</span>
                <span className="font-golos text-xs text-gray-300 dark:text-zinc-600">20</span>
              </div>
            </div>
          </div>
          <button onClick={handleGenerateCats} className="w-full bg-black dark:bg-white text-white dark:text-black font-golos font-medium py-3 flex items-center justify-center gap-2 hover:bg-gray-900 dark:hover:bg-zinc-200 transition-all">
            <Icon name="Sparkles" size={15} />Сгенерировать
          </button>
          {cats.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-golos text-xs text-gray-400 dark:text-zinc-500">{cats.length} имён</span>
                <button onClick={() => copyAll(cats)} className="font-golos text-xs text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
                  <Icon name="Copy" size={12} />Копировать все
                </button>
              </div>
              <div className="space-y-1">
                {cats.map((name, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 px-3 border border-gray-100 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-600 group transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🐱</span>
                      <span className="font-golos text-sm font-medium">{name}</span>
                    </div>
                    <button onClick={() => copyItem(name, 'cat')} className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon name={copiedCat === name ? 'Check' : 'Copy'} size={13} className={copiedCat === name ? 'text-green-500' : 'text-gray-400 dark:text-zinc-500'} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
