import React, { useState } from 'react';
import { PINYIN_GRID_INITIALS, PINYIN_GRID_FINALS } from '../data/pinyinData';
import { audioService } from '../utils/audio';
import { Volume2, Search, Sparkles } from 'lucide-react';

export const InteractivePinyinChart: React.FC = () => {
  const [selectedTone, setSelectedTone] = useState<1 | 2 | 3 | 4>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCell, setActiveCell] = useState<string | null>(null);

  // Tone diacritic mapper
  const applyTone = (pinyin: string, tone: 1 | 2 | 3 | 4): string => {
    const toneMaps: { [key: string]: string[] } = {
      a: ['ā', 'á', 'ǎ', 'à'],
      o: ['ō', 'ó', 'ǒ', 'ò'],
      e: ['ē', 'é', 'ě', 'è'],
      i: ['ī', 'í', 'ǐ', 'ì'],
      u: ['ū', 'ú', 'ǔ', 'ù'],
      ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
    };

    let targetVowel = '';
    if (pinyin.includes('a')) targetVowel = 'a';
    else if (pinyin.includes('o')) targetVowel = 'o';
    else if (pinyin.includes('e')) targetVowel = 'e';
    else if (pinyin.includes('ui')) targetVowel = 'i';
    else if (pinyin.includes('iu')) targetVowel = 'u';
    else if (pinyin.includes('u')) targetVowel = 'u';
    else if (pinyin.includes('ü')) targetVowel = 'ü';
    else if (pinyin.includes('i')) targetVowel = 'i';

    if (targetVowel && toneMaps[targetVowel]) {
      return pinyin.replace(targetVowel, toneMaps[targetVowel][tone - 1]);
    }
    return pinyin;
  };

  const handleCellClick = (initial: string, final: string) => {
    // Specific rule for j, q, x with u (written as u but pronounced as ü)
    let combo = initial + final;
    if (['j', 'q', 'x'].includes(initial) && final === 'ü') {
      combo = initial + 'u';
    }
    const withTone = applyTone(combo, selectedTone);
    setActiveCell(withTone);
    audioService.speakChinese(withTone, { rate: 0.85, tone: selectedTone });
  };

  // Some invalid combinations in Mandarin
  const isInvalidCombo = (initial: string, final: string): boolean => {
    // j, q, x do not combine with a, o, e, u (only with i and ü)
    if (['j', 'q', 'x'].includes(initial) && ['a', 'o', 'e', 'u', 'ai', 'ei', 'ao', 'ou', 'ong'].includes(final)) {
      return true;
    }
    // z, c, s, zh, ch, sh, r do not combine with ü
    if (['z', 'c', 's', 'zh', 'ch', 'sh', 'r', 'd', 't', 'g', 'k', 'h', 'b', 'p', 'm', 'f'].includes(initial) && final === 'ü') {
      return true;
    }
    // b, p, m, f don't combine with e, ong
    if (['b', 'p', 'f'].includes(initial) && ['e', 'ong'].includes(final)) {
      return true;
    }
    return false;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs space-y-4 p-4 sm:p-6 transition-colors">
      {/* Top Filter and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            Bảng Ghép Pinyin Tương Tác (Pinyin Combination Matrix)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Nhấp vào bất kỳ ô nào để nghe phát âm chuẩn theo thanh điệu đã chọn.
          </p>
        </div>

        {/* Tone select */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Thanh điệu:</span>
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {([1, 2, 3, 4] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTone(t)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                  selectedTone === t
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Thanh {t} ({t === 1 ? '—' : t === 2 ? 'ˊ' : t === 3 ? 'ˇ' : 'ˋ'})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
        <table className="w-full text-xs text-center border-collapse">
          <thead>
            <tr className="bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
              <th className="p-2.5 border-r border-slate-200 dark:border-slate-800 sticky left-0 bg-slate-100 dark:bg-slate-800 z-10 text-rose-600 dark:text-rose-400 font-mono">
                Thanh \ Vận
              </th>
              {PINYIN_GRID_FINALS.map((final) => (
                <th key={final} className="p-2 font-mono border-r border-slate-200 dark:border-slate-800 min-w-12">
                  {final}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PINYIN_GRID_INITIALS.map((initial, rIdx) => (
              <tr
                key={initial}
                className={rIdx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-850/40'}
              >
                {/* Initial header sticky column */}
                <td className="p-2 font-mono font-bold text-slate-900 dark:text-slate-100 border-r border-b border-slate-200 dark:border-slate-800 sticky left-0 bg-inherit z-10">
                  {initial}
                </td>

                {PINYIN_GRID_FINALS.map((final) => {
                  const invalid = isInvalidCombo(initial, final);
                  if (invalid) {
                    return (
                      <td
                        key={final}
                        className="p-1.5 border-r border-b border-slate-200/50 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-950/40 text-slate-300 dark:text-slate-700 font-mono select-none"
                      >
                        -
                      </td>
                    );
                  }

                  let syllable = initial + final;
                  if (['j', 'q', 'x'].includes(initial) && final === 'ü') {
                    syllable = initial + 'u';
                  }
                  const withTone = applyTone(syllable, selectedTone);
                  const isCurrent = activeCell === withTone;

                  return (
                    <td
                      key={final}
                      className="p-1 border-r border-b border-slate-200 dark:border-slate-800"
                    >
                      <button
                        onClick={() => handleCellClick(initial, final)}
                        className={`w-full py-1.5 px-1 rounded font-mono font-semibold transition-all ${
                          isCurrent
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 text-slate-700 dark:text-slate-300'
                        }`}
                        title={`Bấm để nghe: ${withTone}`}
                      >
                        {withTone}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2">
        <span>* Ký hiệu "-" là những tổ hợp không tồn tại trong ngữ âm tiếng Hán tiêu chuẩn.</span>
        {activeCell && (
          <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">
            Vừa phát: /{activeCell}/
          </span>
        )}
      </div>
    </div>
  );
};
