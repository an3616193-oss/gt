import React, { useState, useEffect } from 'react';
import { DAILY_CHALLENGE_POOL } from '../data/pinyinData';
import { DailyChallengeItem, UserStats } from '../types/pinyin';
import { speechEvaluator, RecognitionResult } from '../utils/speechRecognition';
import { audioService } from '../utils/audio';
import {
  Mic,
  Volume2,
  Flame,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Trophy,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const DailyPronunciationCheck: React.FC = () => {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('pinyin_user_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      streakDays: 1,
      lastPracticeDate: new Date().toISOString().split('T')[0],
      completedDailyDates: [],
      totalScore: 0,
      audioPracticesCount: 0,
      quizzesCompletedCount: 0,
    };
  });

  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [resultsByItem, setResultsByItem] = useState<{ [id: string]: RecognitionResult }>({});
  const [isCompletedAll, setIsCompletedAll] = useState(false);

  // Take 5 items for the daily set
  const dailySet: DailyChallengeItem[] = DAILY_CHALLENGE_POOL.slice(0, 5);
  const currentItem = dailySet[activeItemIndex];
  const currentResult = resultsByItem[currentItem.id];

  const todayStr = new Date().toISOString().split('T')[0];
  const isAlreadyCompletedToday = stats.completedDailyDates.includes(todayStr);

  const saveStats = (newStats: UserStats) => {
    setStats(newStats);
    localStorage.setItem('pinyin_user_stats', JSON.stringify(newStats));
  };

  const handleListenSample = (text: string) => {
    audioService.speakChinese(text);
  };

  const handleStartRecord = async () => {
    setIsRecording(true);

    const res = await speechEvaluator.listenAndEvaluate(
      currentItem.hanzi,
      currentItem.pinyin,
      (state) => {
        if (state === 'idle') setIsRecording(false);
      }
    );

    setIsRecording(false);
    setResultsByItem((prev) => ({
      ...prev,
      [currentItem.id]: res,
    }));

    if (res.isMatch) {
      audioService.playSuccessChime();

      // Check if all items in daily set are matched
      const updated = {
        ...resultsByItem,
        [currentItem.id]: res,
      };

      const allDone = dailySet.every((item) => updated[item.id] && updated[item.id].isMatch);
      if (allDone) {
        setIsCompletedAll(true);
        if (!isAlreadyCompletedToday) {
          const newCompleted = [...stats.completedDailyDates, todayStr];
          const newStreak = stats.streakDays + 1;
          saveStats({
            ...stats,
            streakDays: newStreak,
            lastPracticeDate: todayStr,
            completedDailyDates: newCompleted,
            totalScore: stats.totalScore + 100,
          });
        }
      }
    } else {
      audioService.playErrorBeep();
    }
  };

  return (
    <div className="space-y-6">
      {/* Daily Banner Card */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 dark:from-rose-900 dark:via-rose-800 dark:to-amber-900 rounded-2xl p-5 sm:p-7 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-colors">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-white/20 dark:bg-white/10 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Thử Thách Phát Âm Hôm Nay</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Kiểm Tra & Chấm Điểm Phát Âm Hàng Ngày
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
            Luyện 5 từ mỗi ngày để tạo thói quen ngữ âm chuẩn Bắc Kinh. Máy sẽ nhận diện giọng nói và chấm điểm độ chính xác ngay tức thì!
          </p>
        </div>

        {/* Streak & Score Counter */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/20 self-start sm:self-auto">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500 rounded-lg text-white">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-mono font-bold block leading-none">
                {stats.streakDays}
              </span>
              <span className="text-[11px] text-rose-100">Ngày streak</span>
            </div>
          </div>

          <div className="h-8 w-px bg-white/20" />

          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500 rounded-lg text-white">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-mono font-bold block leading-none">
                {stats.totalScore}
              </span>
              <span className="text-[11px] text-rose-100">Điểm XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Test Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 cols: Daily Checklist */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2.5 transition-colors shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Nhiệm vụ hôm nay (5 từ)
            </span>
            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
              {Object.values(resultsByItem).filter((r) => r.isMatch).length} / 5 hoàn thành
            </span>
          </div>

          <div className="space-y-1.5">
            {dailySet.map((item, index) => {
              const res = resultsByItem[item.id];
              const isSelected = index === activeItemIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItemIndex(index)}
                  className={`w-full p-3 rounded-lg text-left transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'border-rose-500 dark:border-rose-500 bg-rose-50/50 dark:bg-rose-950/40 shadow-xs'
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-hanzi font-bold text-slate-900 dark:text-slate-100 text-base">
                        {item.hanzi}
                      </div>
                      <div className="font-mono text-xs font-medium text-rose-600 dark:text-rose-400">
                        {item.pinyin}
                      </div>
                    </div>
                  </div>

                  <div>
                    {res?.isMatch ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{res.score}đ</span>
                      </span>
                    ) : res ? (
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                        {res.score}đ
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500">Chưa thử</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 8 cols: Live Speaking Testing Booth */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col items-center text-center relative overflow-hidden transition-colors">
            {/* Difficulty tag */}
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider mb-2">
              Mức độ: {currentItem.difficulty}
            </span>

            {/* Target Hanzi Big Display */}
            <h1 className="text-6xl sm:text-7xl font-hanzi font-extrabold text-slate-900 dark:text-slate-100 my-2 tracking-wide">
              {currentItem.hanzi}
            </h1>

            {/* Target Pinyin with Tone Mark */}
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-rose-600 dark:text-rose-400">
                {currentItem.pinyin}
              </span>
              <button
                onClick={() => handleListenSample(currentItem.hanzi)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 text-slate-700 dark:text-slate-300 transition-colors"
                title="Bấm để nghe phát âm mẫu chuẩn"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
              Nghĩa: {currentItem.vietnameseMeaning} · Hán Việt: {currentItem.hanViet}
            </p>

            {/* Tip box */}
            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 max-w-md flex items-start gap-2 text-left">
              <HelpCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <span>
                <strong>Mẹo phát âm:</strong> {currentItem.tip}
              </span>
            </div>

            {/* Big Recording Button */}
            <div className="mt-8 flex flex-col items-center space-y-3">
              <button
                onClick={handleStartRecord}
                disabled={isRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-md ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-200 dark:ring-rose-900/60 scale-105'
                    : 'bg-rose-600 hover:bg-rose-700 active:scale-95 text-white'
                }`}
                title="Bấm để ghi âm phát âm của bạn"
              >
                <Mic className={`w-8 h-8 ${isRecording ? 'animate-bounce' : ''}`} />
              </button>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                {isRecording ? (
                  <span className="font-bold text-rose-600 dark:text-rose-400 animate-pulse">
                    Đang lắng nghe... Hãy nói ngay bây giờ!
                  </span>
                ) : (
                  <span>Bấm micro và đọc từ "{currentItem.hanzi}"</span>
                )}
              </div>
            </div>

            {/* Result Feedback Card */}
            {currentResult && !isRecording && (
              <div
                className={`mt-6 w-full max-w-md p-4 rounded-xl border text-left transition-all ${
                  currentResult.isMatch
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-950 dark:text-emerald-200'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-950 dark:text-amber-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    {currentResult.isMatch ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    )}
                    <span>
                      {currentResult.isMatch ? 'Phát âm đạt chuẩn!' : 'Chưa chuẩn xác'}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-base">
                    {currentResult.score}/100
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <p>
                    <strong>Máy nhận diện âm bạn nói:</strong> "{currentResult.transcript}"
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">{currentResult.feedback}</p>
                </div>

                {!currentResult.isMatch && (
                  <div className="mt-2.5 pt-2 border-t border-amber-200/60 dark:border-amber-900/60 flex justify-end">
                    <button
                      onClick={handleStartRecord}
                      className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Thử đọc lại</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* All Completed Celebration */}
          {isCompletedAll && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 p-5 rounded-xl text-center space-y-2 transition-colors">
              <div className="inline-flex p-3 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-full">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-100">
                Xuất sắc! Bạn đã vượt qua tất cả 5 từ thử thách hôm nay!
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                Chuỗi ngày học tập (Streak) của bạn đã được tăng lên. Hãy quay lại vào ngày mai để duy trì mạch học tập nhé!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
