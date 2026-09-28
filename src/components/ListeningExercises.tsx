import React, { useState } from 'react';
import { MINIMAL_PAIRS, LISTENING_QUESTIONS } from '../data/pinyinData';
import { MinimalPairExercise, ListeningQuizQuestion } from '../types/pinyin';
import { audioService } from '../utils/audio';
import {
  Volume2,
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Headphones,
  Award,
} from 'lucide-react';

export const ListeningExercises: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'minimal_pairs'>('quiz');

  // Quiz states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Minimal pair trainer state
  const [selectedPair, setSelectedPair] = useState<MinimalPairExercise>(MINIMAL_PAIRS[0]);
  const [blindChallengeTarget, setBlindChallengeTarget] = useState<'A' | 'B' | null>(null);
  const [blindUserChoice, setBlindUserChoice] = useState<'A' | 'B' | null>(null);

  const currentQ: ListeningQuizQuestion = LISTENING_QUESTIONS[currentQuestionIndex];

  const handlePlayQuizAudio = () => {
    audioService.speakChinese(currentQ.audioTarget);
  };

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (hasAnswered) return;
    setSelectedOptionId(optionId);
    setHasAnswered(true);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      audioService.playSuccessChime();
    } else {
      audioService.playErrorBeep();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < LISTENING_QUESTIONS.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setHasAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setHasAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  // Minimal pair blind drill
  const handleStartBlindChallenge = () => {
    const pick: 'A' | 'B' = Math.random() > 0.5 ? 'A' : 'B';
    setBlindChallengeTarget(pick);
    setBlindUserChoice(null);
    const audioText = pick === 'A' ? selectedPair.soundA.audio : selectedPair.soundB.audio;
    audioService.speakChinese(audioText);
  };

  const handleGuessBlind = (choice: 'A' | 'B') => {
    if (blindUserChoice !== null || !blindChallengeTarget) return;
    setBlindUserChoice(choice);
    if (choice === blindChallengeTarget) {
      audioService.playSuccessChime();
    } else {
      audioService.playErrorBeep();
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Headphones className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Bài Tập Trắc Nghiệm Nghe ({LISTENING_QUESTIONS.length} câu)</span>
          </button>
          <button
            onClick={() => setActiveTab('minimal_pairs')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'minimal_pairs'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Luyện Cặp Âm Dễ Nhầm (Minimal Pairs)</span>
          </button>
        </div>
      </div>

      {activeTab === 'quiz' ? (
        <div className="max-w-3xl mx-auto">
          {!quizFinished ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs transition-colors">
              {/* Progress & Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Câu hỏi {currentQuestionIndex + 1} / {LISTENING_QUESTIONS.length}
                </span>
                <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                  Điểm: {score}
                </span>
              </div>

              {/* Title & Audio button */}
              <div className="text-center space-y-3 mb-6">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  {currentQ.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {currentQ.instruction}
                </p>

                {/* Big Audio Trigger Button */}
                <div className="pt-2 flex justify-center">
                  <button
                    onClick={handlePlayQuizAudio}
                    className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center gap-2.5 animate-pulse"
                  >
                    <Volume2 className="w-5 h-5" />
                    <span>Bấm để nghe âm thanh</span>
                  </button>
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {currentQ.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  let btnStyle = 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800/80';

                  if (hasAnswered) {
                    if (option.isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                    } else if (isSelected && !option.isCorrect) {
                      btnStyle = 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                    } else {
                      btnStyle = 'border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option.id, option.isCorrect)}
                      disabled={hasAnswered}
                      className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <div>
                        <div className="font-mono text-base font-bold">{option.label}</div>
                        {option.subLabel && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{option.subLabel}</div>
                        )}
                      </div>

                      {hasAnswered && (
                        <div>
                          {option.isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          ) : isSelected ? (
                            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                          ) : null}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next Button */}
              {hasAnswered && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/90 dark:border-slate-700 text-xs sm:text-sm space-y-3">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      <strong className="text-slate-900 dark:text-slate-100 block mb-0.5">Giải thích ngữ âm:</strong>
                      {currentQ.explanation}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-rose-600 dark:hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <span>
                        {currentQuestionIndex + 1 === LISTENING_QUESTIONS.length
                          ? 'Xem kết quả'
                          : 'Câu tiếp theo'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completed Screen */
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4 shadow-xs transition-colors">
              <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Chúc mừng bạn đã hoàn thành bài tập nghe!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Kết quả của bạn:{' '}
                <strong className="text-rose-600 dark:text-rose-400 font-mono text-base">
                  {score} / {LISTENING_QUESTIONS.length}
                </strong>{' '}
                câu đúng ({Math.round((score / LISTENING_QUESTIONS.length) * 100)}%).
              </p>

              <div className="pt-2">
                <button
                  onClick={handleRestartQuiz}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Làm lại bài tập nghe</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Minimal Pairs Discrimination Studio */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left list of minimal pairs */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 space-y-1.5 transition-colors shadow-xs">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2 px-1">
              Danh sách cặp âm tương phản:
            </span>
            {MINIMAL_PAIRS.map((pair) => {
              const isSelected = selectedPair.id === pair.id;
              return (
                <button
                  key={pair.id}
                  onClick={() => {
                    setSelectedPair(pair);
                    setBlindChallengeTarget(null);
                    setBlindUserChoice(null);
                  }}
                  className={`w-full p-2.5 rounded-lg text-left text-xs font-medium transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-bold border border-rose-200 dark:border-rose-900'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent'
                  }`}
                >
                  <span>{pair.pairName}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              );
            })}
          </div>

          {/* Right side interactive pair tester */}
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs transition-colors">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                {selectedPair.pairName}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                {selectedPair.explanation}
              </p>

              {/* Side-by-side comparison boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sound A */}
                <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                        Âm 1: {selectedPair.soundA.symbol}
                      </span>
                      <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                        {selectedPair.soundA.pinyin}
                      </span>
                    </div>
                    <div className="text-3xl font-hanzi font-bold text-slate-900 dark:text-slate-100 my-2">
                      {selectedPair.soundA.hanzi}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Nghĩa: {selectedPair.soundA.meaning}
                    </div>
                  </div>
                  <button
                    onClick={() => audioService.speakChinese(selectedPair.soundA.audio)}
                    className="mt-4 w-full py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-800 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe âm A ({selectedPair.soundA.pinyin})</span>
                  </button>
                </div>

                {/* Sound B */}
                <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                        Âm 2: {selectedPair.soundB.symbol}
                      </span>
                      <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                        {selectedPair.soundB.pinyin}
                      </span>
                    </div>
                    <div className="text-3xl font-hanzi font-bold text-slate-900 dark:text-slate-100 my-2">
                      {selectedPair.soundB.hanzi}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Nghĩa: {selectedPair.soundB.meaning}
                    </div>
                  </div>
                  <button
                    onClick={() => audioService.speakChinese(selectedPair.soundB.audio)}
                    className="mt-4 w-full py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-800 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe âm B ({selectedPair.soundB.pinyin})</span>
                  </button>
                </div>
              </div>

              {/* Blind Challenge: Test Your Ear */}
              <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    Thử thách thính giác mù (Đoán xem máy vừa đọc âm nào):
                  </h4>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-center space-y-3">
                  {!blindChallengeTarget ? (
                    <button
                      onClick={handleStartBlindChallenge}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-rose-600 dark:hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                    >
                      Bấm để phát ngẫu nhiên âm A hoặc B
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        Bạn vừa nghe thấy âm nào? Hãy chọn đáp án:
                      </p>
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleGuessBlind('A')}
                          disabled={blindUserChoice !== null}
                          className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-rose-500 rounded-lg text-xs font-bold font-mono text-slate-800 dark:text-slate-200 transition-colors shadow-2xs"
                        >
                          Âm A: {selectedPair.soundA.pinyin} ({selectedPair.soundA.hanzi})
                        </button>
                        <button
                          onClick={() => handleGuessBlind('B')}
                          disabled={blindUserChoice !== null}
                          className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-rose-500 rounded-lg text-xs font-bold font-mono text-slate-800 dark:text-slate-200 transition-colors shadow-2xs"
                        >
                          Âm B: {selectedPair.soundB.pinyin} ({selectedPair.soundB.hanzi})
                        </button>
                      </div>

                      {blindUserChoice !== null && (
                        <div
                          className={`p-3 rounded-lg text-xs font-medium inline-block ${
                            blindUserChoice === blindChallengeTarget
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200'
                          }`}
                        >
                          {blindUserChoice === blindChallengeTarget
                            ? `Chính xác! Đó là âm ${blindChallengeTarget} (${
                                blindChallengeTarget === 'A'
                                    ? selectedPair.soundA.pinyin
                                    : selectedPair.soundB.pinyin
                              }). Tai bạn rất thính!`
                            : `Chưa đúng rồi! Máy vừa đọc âm ${blindChallengeTarget} (${
                                blindChallengeTarget === 'A'
                                    ? selectedPair.soundA.pinyin
                                    : selectedPair.soundB.pinyin
                              }). Hãy nghe lại nhé.`}
                        </div>
                      )}

                      {blindUserChoice !== null && (
                        <div className="pt-1">
                          <button
                            onClick={handleStartBlindChallenge}
                            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-md transition-colors"
                          >
                            Thử lại lần nữa
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
