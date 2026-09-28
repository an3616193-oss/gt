import React from 'react';
import { audioService } from '../utils/audio';
import { Volume2, BookOpen } from 'lucide-react';

export const RulesHandbook: React.FC = () => {
  const handlePlay = (text: string) => {
    audioService.speakChinese(text);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          Cẩm Nang Quy Tắc Biến Điệu & Quy Tắc Viết Pinyin Cần Biết
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Khi ghép từ và nói câu thực tế, tiếng Trung có một số quy tắc biến âm (Tone Sandhi) bắt buộc để câu nói mượt mà, tự nhiên.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rule 1: Two Tone 3 Sandhi */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Biến điệu hai Thanh 3 đi liền nhau (3 + 3 → 2 + 3)
            </h4>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Khi hai âm tiết mang thanh 3 đứng cạnh nhau, âm tiết thứ nhất sẽ tự động chuyển thành đọc như <strong>Thanh 2 (Dương bình)</strong>, âm tiết thứ hai giữ nguyên thanh 3.
          </p>

          <div className="p-3 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900 rounded-lg text-xs space-y-2">
            <div className="font-semibold text-rose-950 dark:text-rose-200">Công thức: [Thanh 3 + Thanh 3] → [Thanh 2 + Thanh 3]</div>
            <div className="text-slate-600 dark:text-slate-400 text-[11px]">* Lưu ý: Chữ viết Pinyin vẫn giữ nguyên dấu thanh 3 ban đầu, nhưng khi đọc phải biến âm!</div>
          </div>

          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Ví dụ thực tế:</span>
            {[
              { text: '你好', written: 'nǐ hǎo', pronounced: 'ní hǎo', meaning: 'Xin chào' },
              { text: '很好', written: 'hěn hǎo', pronounced: 'hén hǎo', meaning: 'Rất tốt' },
              { text: '可以', written: 'kěyǐ', pronounced: 'kéyǐ', meaning: 'Có thể' },
              { text: '手表', written: 'shǒubiǎo', pronounced: 'shóubiǎo', meaning: 'Đồng hồ đeo tay' },
            ].map((ex, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-hanzi font-bold text-base text-slate-900 dark:text-slate-100 mr-2">
                    {ex.text}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 line-through mr-1 font-mono">{ex.written}</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold font-mono">→ {ex.pronounced}</span>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{ex.meaning}</div>
                </div>

                <button
                  onClick={() => handlePlay(ex.text)}
                  className="p-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 text-slate-700 dark:text-slate-300 transition-colors"
                  title="Bấm nghe phát âm chuẩn biến điệu"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Rule 2: Biến điệu chữ "不" (Bù) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Biến điệu của chữ "不" (Bù - Không)
            </h4>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Nguyên bản chữ "不" mang thanh 4 (bù). Tuy nhiên:
            <br />
            • Khi đứng trước một từ mang <strong>Thanh 4</strong>, "不" sẽ đổi thành <strong>Thanh 2 (bú)</strong>.
            <br />
            • Khi đứng trước Thanh 1, 2, 3 thì giữ nguyên là "bù".
          </p>

          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Ví dụ thực tế:</span>
            {[
              { text: '不是', pinyin: 'bú shì', note: 'Đứng trước shì (thanh 4) → bú', meaning: 'Không phải là' },
              { text: '不去', pinyin: 'bú qù', note: 'Đứng trước qù (thanh 4) → bú', meaning: 'Không đi' },
              { text: '不好', pinyin: 'bù hǎo', note: 'Đứng trước hǎo (thanh 3) → giữ nguyên bù', meaning: 'Không tốt' },
              { text: '不要', pinyin: 'bú yào', note: 'Đứng trước yào (thanh 4) → bú', meaning: 'Đừng, không cần' },
            ].map((ex, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-hanzi font-bold text-base text-slate-900 dark:text-slate-100 mr-2">
                    {ex.text}
                  </span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold font-mono">{ex.pinyin}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] ml-2">({ex.meaning})</span>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{ex.note}</div>
                </div>

                <button
                  onClick={() => handlePlay(ex.text)}
                  className="p-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Rule 3: Biến điệu chữ "一" (Yī) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Biến điệu của chữ "一" (Yī - Số một)
            </h4>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            • Đọc đơn lẻ hoặc đếm số: giữ nguyên <strong>Thanh 1 (yī)</strong> (ví dụ: yī, èr, sān).
            <br />
            • Đứng trước từ mang <strong>Thanh 4</strong>: đổi thành <strong>Thanh 2 (yí)</strong> (ví dụ: 一个 yí ge).
            <br />
            • Đứng trước từ mang <strong>Thanh 1, 2, 3</strong>: đổi thành <strong>Thanh 4 (yì)</strong> (ví dụ: 一天 yì tiān).
          </p>

          <div className="space-y-2 pt-1">
            {[
              { text: '一个', pinyin: 'yí ge', note: 'Đứng trước thanh 4 → yí', meaning: 'Một cái' },
              { text: '一天', pinyin: 'yì tiān', note: 'Đứng trước tiān (thanh 1) → yì', meaning: 'Một ngày' },
              { text: '一起', pinyin: 'yì qǐ', note: 'Đứng trước qǐ (thanh 3) → yì', meaning: 'Cùng nhau' },
            ].map((ex, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-hanzi font-bold text-base text-slate-900 dark:text-slate-100 mr-2">
                    {ex.text}
                  </span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold font-mono">{ex.pinyin}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] ml-2">({ex.meaning})</span>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{ex.note}</div>
                </div>

                <button
                  onClick={() => handlePlay(ex.text)}
                  className="p-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Rule 4: Quy tắc bỏ 2 chấm của "ü" */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center">
              4
            </span>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Quy tắc viết chữ "ü" (Bỏ 2 chấm)
            </h4>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            • Khi <strong>ü</strong> kết hợp với 4 phụ âm <strong>[j, q, x, y]</strong>, ta <strong>bỏ dấu 2 chấm</strong> trên đầu và viết là <strong>u</strong> (ju, qu, xu, yu), NHƯNG vẫn đọc là <strong>ü (uy)</strong>!
            <br />
            • Khi đi với <strong>n, l</strong>: PHẢI giữ nguyên 2 chấm (nǚ, lǜ) để phân biệt với nu, lu.
          </p>

          <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-lg text-xs text-amber-900 dark:text-amber-200">
            <strong className="block mb-0.5">Mẹo nhớ cho người mới:</strong>
            "j, q, x, y gặp anh chàng ü, lột bỏ mũ 2 chấm nhưng tính nết (cách phát âm) vẫn giữ nguyên!"
          </div>

          <div className="space-y-2 pt-1">
            {[
              { text: '句子', pinyin: 'jùzi', actualSound: 'j + ü', meaning: 'Câu cú' },
              { text: '去', pinyin: 'qù', actualSound: 'q + ü', meaning: 'Đi' },
              { text: '需要', pinyin: 'xūyào', actualSound: 'x + ü', meaning: 'Nhu cầu, cần' },
              { text: '月亮', pinyin: 'yuèliang', actualSound: 'y + üe', meaning: 'Mặt trăng' },
            ].map((ex, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-hanzi font-bold text-base text-slate-900 dark:text-slate-100 mr-2">
                    {ex.text}
                  </span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold font-mono">{ex.pinyin}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] ml-2">({ex.meaning})</span>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Bản chất âm: {ex.actualSound}</div>
                </div>

                <button
                  onClick={() => handlePlay(ex.text)}
                  className="p-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
