import React, { useState, useEffect } from 'react';
import {
  CONFUSING_PAIRS_FLASHCARDS,
  FlashcardPair,
} from '../data/flashcardData';
import { audioService } from '../utils/audio';
import {
  Volume2,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Filter,
  Layers,
  Wind,
} from 'lucide-react';

interface PronunciationFlashcardsProps {
  onSelectSoundForAnatomy?: (symbol: string) => void;
}

export const PronunciationFlashcards: React.FC<PronunciationFlashcardsProps> = ({
  onSelectSoundForAnatomy,
}) => {
  const [cards, setCards] = useState<FlashcardPair[]>(CONFUSING_PAIRS_FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [playingKey, setPlayingKey] = useState<string | null>(null);

  // Memorization tracking in localStorage
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('pinyin_flashcards_mastered');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    let filtered = CONFUSING_PAIRS_FLASHCARDS;
    if (filterCategory === 'aspiration') {
      filtered = CONFUSING_PAIRS_FLASHCARDS.filter((c) =>
        ['card_b_p', 'card_d_t', 'card_g_k'].includes(c.id)
      );
    } else if (filterCategory === 'tongue') {
      filtered = CONFUSING_PAIRS_FLASHCARDS.filter((c) =>
        ['card_j_q_x', 'card_z_c_s', 'card_zh_ch_sh_r', 'card_z_zh_contrast'].includes(c.id)
      );
    } else if (filterCategory === 'finals') {
      filtered = CONFUSING_PAIRS_FLASHCARDS.filter((c) =>
        ['card_an_ang', 'card_in_ing', 'card_u_yu'].includes(c.id)
      );
    }
    setCards(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [filterCategory]);

  const currentCard = cards[currentIndex] || cards[0];

  const handlePlayAudio = async (text: string, keyId: string) => {
    setPlayingKey(keyId);
    await audioService.speakChinese(text);
    setPlayingKey(null);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const toggleMastered = (cardId: string) => {
    let updated: string[];
    if (masteredIds.includes(cardId)) {
      updated = masteredIds.filter((id) => id !== cardId);
    } else {
      updated = [...masteredIds, cardId];
    }
    setMasteredIds(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pinyin_flashcards_mastered', JSON.stringify(updated));
    }
  };

  const isCurrentMastered = currentCard ? masteredIds.includes(currentCard.id) : false;

  return (
    <div className="space-y-6">
      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Lọc cặp âm:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterCategory === 'all'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Tất cả (9 bộ)
            </button>
            <button
              onClick={() => setFilterCategory('aspiration')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterCategory === 'aspiration'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Cặp Bật Hơi (b-p, d-t, g-k)
            </button>
            <button
              onClick={() => setFilterCategory('tongue')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterCategory === 'tongue'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Mặt Lưỡi & Uốn Lưỡi (j-q-x, zh-ch-sh)
            </button>
            <button
              onClick={() => setFilterCategory('finals')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterCategory === 'finals'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Vần Mũi & Nguyên Âm (an-ang, u-ü)
            </button>
          </div>
        </div>

        {/* Progress & Shuffle */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Đã thuộc:</span>
            <strong className="text-slate-900 dark:text-slate-100 font-mono">
              {masteredIds.length}/{CONFUSING_PAIRS_FLASHCARDS.length}
            </strong>
          </div>
          <button
            onClick={handleShuffle}
            className="p-1.5 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Xáo trộn thứ tự thẻ ôn tập"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Xáo trộn</span>
          </button>
        </div>
      </div>

      {/* Main Flashcard Container */}
      {currentCard && (
        <div className="relative">
          {/* Card Frame */}
          <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200/90 dark:border-slate-800 shadow-md transition-all overflow-hidden">
            {/* Card Header Bar */}
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                  {currentCard.categoryLabel}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                  {currentCard.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {currentIndex + 1} / {cards.length}
                </span>
                <button
                  onClick={() => toggleMastered(currentCard.id)}
                  className={`p-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isCurrentMastered
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title={isCurrentMastered ? 'Bấm để đánh dấu cần ôn lại' : 'Bấm để đánh dấu đã thuộc'}
                >
                  <CheckCircle className={`w-3.5 h-3.5 ${isCurrentMastered ? 'text-emerald-600' : ''}`} />
                  <span className="hidden sm:inline">
                    {isCurrentMastered ? 'Đã nhớ' : 'Chưa nhớ'}
                  </span>
                </button>
              </div>
            </div>

            {/* Card Body - Front & Back */}
            <div className="p-5 sm:p-7 min-h-[380px] flex flex-col justify-between">
              {!isFlipped ? (
                /* === FRONT OF CARD: SOUNDS SHOWCASE === */
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Mặt trước · Lắng nghe & So sánh vị trí
                    </span>
                    <h4 className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300">
                      Bấm loa từng âm để nghe phân biệt luồng hơi và cách nhả âm:
                    </h4>
                  </div>

                  {/* Sounds Grid on Front */}
                  <div
                    className={`grid gap-4 ${
                      currentCard.sounds.length === 3
                        ? 'grid-cols-1 md:grid-cols-3'
                        : 'grid-cols-1 md:grid-cols-2'
                    }`}
                  >
                    {currentCard.sounds.map((sound, sIdx) => {
                      const isAsp = sound.aspiration === 'aspirated';
                      const isPlaying = playingKey === `front_${sound.symbol}`;
                      return (
                        <div
                          key={sIdx}
                          className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between hover:border-rose-300 dark:hover:border-rose-900 transition-colors relative group"
                        >
                          {/* Badge tag */}
                          <div className="flex items-center justify-between mb-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                isAsp
                                  ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                  : 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                              }`}
                            >
                              {isAsp ? 'Bật hơi mạnh' : sound.aspiration === 'friction' ? 'Âm xát' : 'Không bật hơi'}
                            </span>
                            <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                              IPA: {sound.ipa}
                            </span>
                          </div>

                          {/* Sound Symbol Big */}
                          <div className="text-center my-2">
                            <span className="text-5xl font-mono font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                              {sound.symbol}
                            </span>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium">
                              {sound.vietnameseApprox}
                            </p>
                          </div>

                          {/* Technique short */}
                          <div className="mt-3 p-2.5 rounded-lg bg-white dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            <strong className="text-slate-900 dark:text-slate-100 block mb-0.5">
                              Khẩu hình & Luồng hơi:
                            </strong>
                            {sound.keyTechnique}
                          </div>

                          {/* Sample word & Action */}
                          <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-hanzi font-bold text-slate-900 dark:text-slate-100">
                                {sound.sampleWord.hanzi}
                              </span>
                              <div className="text-left">
                                <div className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                                  {sound.sampleWord.pinyin}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                  {sound.sampleWord.meaning}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() =>
                                handlePlayAudio(sound.sampleWord.audioText, `front_${sound.symbol}`)
                              }
                              className={`p-2.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 active:scale-95 transition-all shadow-2xs flex items-center gap-1.5 text-xs font-semibold ${
                                isPlaying ? 'animate-bounce' : ''
                              }`}
                              title={`Nghe âm thanh mẫu ${sound.symbol}`}
                            >
                              <Volume2 className="w-4 h-4" />
                              <span>Nghe</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Prompt hint */}
                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Nhấp nút <strong>"Lật Thẻ Xem Bí Kíp & Ví Dụ"</strong> bên dưới để xem bảng phân biệt chi tiết!</span>
                    </p>
                  </div>
                </div>
              ) : (
                /* === BACK OF CARD: DETAILED DISTINCTION & MINIMAL PAIR WORDS === */
                <div className="space-y-5 animate-fadeIn">
                  <div className="text-center space-y-1">
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest flex items-center justify-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Mặt sau · Bí kíp phân biệt & Cặp từ đối chiếu
                    </span>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {currentCard.distinctionRule}
                    </h4>
                  </div>

                  {/* Mouth tip & Paper test cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs">
                      <strong className="text-amber-950 dark:text-amber-200 font-bold block mb-1 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-600" /> Mẹo ghi nhớ cho người Việt:
                      </strong>
                      <p className="text-amber-900 dark:text-amber-300 leading-relaxed">
                        {currentCard.mouthTip}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-xs">
                      <strong className="text-emerald-950 dark:text-emerald-200 font-bold block mb-1 flex items-center gap-1.5">
                        <Wind className="w-3.5 h-3.5 text-emerald-600" /> Thí nghiệm kiểm tra tờ giấy:
                      </strong>
                      <p className="text-emerald-900 dark:text-emerald-300 leading-relaxed">
                        {currentCard.paperTest}
                      </p>
                    </div>
                  </div>

                  {/* Contrast Minimal Pairs Table */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                      Các cặp từ đối chiếu thực tế (Bấm nghe từng từ để so sánh):
                    </span>

                    <div className="space-y-2">
                      {currentCard.contrastExamples.map((pair, pIdx) => (
                        <div
                          key={pIdx}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          {/* Word A */}
                          <div className="flex items-center justify-between sm:justify-start gap-3 flex-1">
                            <div>
                              <div className="font-hanzi font-bold text-base text-slate-900 dark:text-slate-100">
                                {pair.wordA.hanzi}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                {pair.wordA.meaning}
                              </div>
                            </div>
                            <button
                              onClick={() => handlePlayAudio(pair.wordA.audio, `wA_${pIdx}`)}
                              className="p-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 text-slate-700 dark:text-slate-300 flex items-center gap-1 font-semibold transition-colors"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span className="font-mono">{pair.wordA.pinyin}</span>
                            </button>
                          </div>

                          <span className="hidden sm:inline font-bold text-slate-300 dark:text-slate-700">
                            vs
                          </span>

                          {/* Word B */}
                          <div className="flex items-center justify-between sm:justify-start gap-3 flex-1">
                            <div>
                              <div className="font-hanzi font-bold text-base text-slate-900 dark:text-slate-100">
                                {pair.wordB.hanzi}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                {pair.wordB.meaning}
                              </div>
                            </div>
                            <button
                              onClick={() => handlePlayAudio(pair.wordB.audio, `wB_${pIdx}`)}
                              className="p-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 text-slate-700 dark:text-slate-300 flex items-center gap-1 font-semibold transition-colors"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span className="font-mono">{pair.wordB.pinyin}</span>
                            </button>
                          </div>

                          {/* Optional Word C */}
                          {pair.wordC && (
                            <>
                              <span className="hidden sm:inline font-bold text-slate-300 dark:text-slate-700">
                                vs
                              </span>
                              <div className="flex items-center justify-between sm:justify-start gap-3 flex-1">
                                <div>
                                  <div className="font-hanzi font-bold text-base text-slate-900 dark:text-slate-100">
                                    {pair.wordC.hanzi}
                                  </div>
                                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                    {pair.wordC.meaning}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handlePlayAudio(pair.wordC!.audio, `wC_${pIdx}`)}
                                  className="p-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 text-slate-700 dark:text-slate-300 flex items-center gap-1 font-semibold transition-colors"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                  <span className="font-mono">{pair.wordC.pinyin}</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Flip Button */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center">
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95"
                >
                  <RotateCw className="w-4 h-4 text-rose-500 dark:text-rose-600" />
                  <span>{isFlipped ? 'Quay lại mặt trước (Nghe từng âm)' : 'Lật thẻ xem Bí kíp & Ví dụ đối chiếu'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Arrows Below */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="p-2.5 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Cặp trước</span>
            </button>

            {/* Quick jump dots */}
            <div className="hidden sm:flex items-center gap-1.5">
              {cards.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCurrentIndex(i);
                    setIsFlipped(false);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === i
                      ? 'w-6 bg-rose-600 dark:bg-rose-400'
                      : masteredIds.includes(c.id)
                      ? 'w-2 bg-emerald-400 dark:bg-emerald-600'
                      : 'w-2 bg-slate-300 dark:bg-slate-700'
                  }`}
                  title={`${c.title} (${i + 1}/${cards.length})`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2.5 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Cặp kế tiếp</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
