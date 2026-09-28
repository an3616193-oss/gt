import React, { useState } from 'react';
import { TONES_DATA } from '../data/pinyinData';
import { ToneInfo } from '../types/pinyin';
import { audioService } from '../utils/audio';
import { Volume2, Play, Info, Sparkles } from 'lucide-react';

export const ToneGuideVisualizer: React.FC = () => {
  const [selectedTone, setSelectedTone] = useState<ToneInfo>(TONES_DATA[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayTone = async (tone: ToneInfo, syllable?: string) => {
    setIsPlaying(true);
    if (syllable) {
      await audioService.speakChinese(syllable, { rate: 0.8, tone: tone.toneNumber });
    } else {
      audioService.playToneContour(tone.toneNumber);
    }
    setIsPlaying(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              Biểu đồ cao độ 4 Thanh Điệu (Chao 5-Level Pitch Contour)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tiếng Trung là ngôn ngữ thanh điệu. Cùng một âm tiết nhưng khác thanh điệu sẽ mang nghĩa hoàn toàn khác biệt.
            </p>
          </div>

          {/* Tone Selector Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 dark:bg-slate-800 rounded-lg overflow-x-auto">
            {TONES_DATA.map((tone) => {
              const active = selectedTone.toneNumber === tone.toneNumber;
              return (
                <button
                  key={tone.toneNumber}
                  onClick={() => setSelectedTone(tone)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {tone.toneNumber === 0 ? 'Thanh nhẹ' : `Thanh ${tone.toneNumber}`}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive Chao Pitch Grid Chart */}
        <div className="lg:col-span-6 bg-slate-900 dark:bg-slate-950 text-white rounded-xl p-5 relative overflow-hidden flex flex-col items-center border border-slate-800">
          <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2 border-b border-slate-800 pb-2">
            <span>Cao độ 5 bậc ngữ âm học</span>
            <span className="text-rose-400 font-mono font-medium">Cao độ: {selectedTone.pitchValue}</span>
          </div>

          {/* SVG Pitch Graph Canvas */}
          <div className="w-full h-56 relative">
            <svg viewBox="0 0 320 200" className="w-full h-full select-none">
              {/* Horizontal 5 level reference lines */}
              {[5, 4, 3, 2, 1].map((level, idx) => {
                const y = 30 + idx * 35;
                const levelNames = ['5 (Cao nhất)', '4 (Bán cao)', '3 (Trung bình)', '2 (Bán thấp)', '1 (Đáy thấp)'];
                return (
                  <g key={level}>
                    <line
                      x1="45"
                      y1={y}
                      x2="305"
                      y2={y}
                      stroke="#334155"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    <text x="35" y={y + 4} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                      {level}
                    </text>
                    <text x="50" y={y - 4} fill="#475569" fontSize="8">
                      {levelNames[idx]}
                    </text>
                  </g>
                );
              })}

              {/* Inactive tone reference faint curves */}
              {TONES_DATA.filter((t) => t.toneNumber !== selectedTone.toneNumber && t.toneNumber !== 0).map(
                (t) => {
                  let pathD = '';
                  if (t.toneNumber === 1) pathD = 'M 60 30 L 290 30';
                  if (t.toneNumber === 2) pathD = 'M 60 100 Q 180 65 290 30';
                  if (t.toneNumber === 3) pathD = 'M 60 115 Q 160 170 290 65';
                  if (t.toneNumber === 4) pathD = 'M 60 30 L 290 170';
                  return (
                    <path
                      key={t.toneNumber}
                      d={pathD}
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  );
                }
              )}

              {/* Active Tone Pitch Curve */}
              {selectedTone.toneNumber === 1 && (
                <g>
                  <line
                    x1="60"
                    y1="30"
                    x2="290"
                    y2="30"
                    stroke="#f43f5e"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="drop-shadow-md"
                  />
                  <circle cx="60" cy="30" r="5" fill="#f43f5e" />
                  <circle cx="290" cy="30" r="5" fill="#f43f5e" />
                  <text x="175" y="20" fill="#f43f5e" fontSize="11" textAnchor="middle" fontWeight="bold">
                    Cao bằng 55 (mā)
                  </text>
                </g>
              )}

              {selectedTone.toneNumber === 2 && (
                <g>
                  <path
                    d="M 60 100 Q 180 65 290 30"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="drop-shadow-md"
                  />
                  <circle cx="60" cy="100" r="5" fill="#0284c7" />
                  <circle cx="290" cy="30" r="5" fill="#0284c7" />
                  <text x="175" y="55" fill="#38bdf8" fontSize="11" textAnchor="middle" fontWeight="bold">
                    Đi lên 35 (má)
                  </text>
                </g>
              )}

              {selectedTone.toneNumber === 3 && (
                <g>
                  <path
                    d="M 60 115 Q 160 185 290 65"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="drop-shadow-md"
                  />
                  <circle cx="60" cy="115" r="5" fill="#10b981" />
                  <circle cx="160" cy="170" r="5" fill="#10b981" />
                  <circle cx="290" cy="65" r="5" fill="#10b981" />
                  <text x="160" y="192" fill="#34d399" fontSize="11" textAnchor="middle" fontWeight="bold">
                    Xuống đáy rồi lên 214 (mǎ)
                  </text>
                </g>
              )}

              {selectedTone.toneNumber === 4 && (
                <g>
                  <line
                    x1="60"
                    y1="30"
                    x2="290"
                    y2="170"
                    stroke="#f59e0b"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="drop-shadow-md"
                  />
                  <circle cx="60" cy="30" r="5" fill="#f59e0b" />
                  <circle cx="290" cy="170" r="5" fill="#f59e0b" />
                  <text x="175" y="90" fill="#fbbf24" fontSize="11" textAnchor="middle" fontWeight="bold">
                    Rơi mạnh dứt khoát 51 (mà)
                  </text>
                </g>
              )}

              {selectedTone.toneNumber === 0 && (
                <g>
                  <circle cx="175" cy="120" r="8" fill="#a855f7" />
                  <text x="175" y="145" fill="#c084fc" fontSize="11" textAnchor="middle" fontWeight="bold">
                    Nhẹ & ngắn (ma)
                  </text>
                </g>
              )}
            </svg>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => handlePlayTone(selectedTone)}
              disabled={isPlaying}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors border border-slate-700"
            >
              <Volume2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Nghe mô phỏng sóng âm (F0)</span>
            </button>
          </div>
        </div>

        {/* Right: Detailed Guide & Syllable Examples */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedTone.name}</span>
              <span className="text-xs text-rose-700 dark:text-rose-300 font-hanzi bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded font-medium border border-rose-200 dark:border-rose-900">
                {selectedTone.hanziName}
              </span>
            </div>
            <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mt-1">
              Đặc điểm: {selectedTone.pitchDescription}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              {selectedTone.description}
            </p>
          </div>

          {/* Vietnamese comparison card */}
          <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/60 rounded-lg text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-950 dark:text-amber-200 font-semibold mb-0.5">
                So sánh với tiếng Việt & Mẹo ghi nhớ:
              </strong>
              {selectedTone.vietnameseComparison}
            </div>
          </div>

          {/* Practical Syllables */}
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-2">
              Các từ ví dụ tiêu biểu (Bấm để nghe)
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {selectedTone.exampleSyllables.map((syl, i) => (
                <button
                  key={i}
                  onClick={() => handlePlayTone(selectedTone, syl.hanzi)}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-500 bg-white dark:bg-slate-800 hover:bg-rose-50/30 dark:hover:bg-rose-950/30 transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-hanzi font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                      {syl.hanzi}
                    </span>
                    <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400" />
                  </div>
                  <div className="text-xs font-bold font-mono text-rose-600 dark:text-rose-400 mt-0.5">
                    {syl.pinyin}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {syl.meaning}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
