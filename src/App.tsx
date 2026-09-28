/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PronunciationStudio } from './components/PronunciationStudio';
import { InteractivePinyinChart } from './components/InteractivePinyinChart';
import { ListeningExercises } from './components/ListeningExercises';
import { DailyPronunciationCheck } from './components/DailyPronunciationCheck';
import { RulesHandbook } from './components/RulesHandbook';
import { AudioSettingsModal } from './components/AudioSettingsModal';
import { HanziWritingGuide } from './components/HanziWritingGuide';
import {
  Flame,
  CheckCircle2,
  Sliders,
  Sun,
  Moon,
  PenTool,
  WifiOff,
} from 'lucide-react';

type NavTab = 'studio' | 'writing' | 'chart' | 'listening' | 'daily' | 'rules';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('studio');
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState(false);

  // Dark mode state: default to dark as requested by user, with localStorage memory
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pinyin_theme');
      if (saved) return saved === 'dark';
    }
    return true; // Default to dark theme
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('pinyin_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('pinyin_theme', 'light');
      }
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100 selection:bg-rose-100 selection:text-rose-900 transition-colors duration-200`}>
      {/* Top Bar Contract (Strict 3-zone standard) */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab('studio')}
            className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2 group"
          >
            <span className="font-hanzi text-rose-600 dark:text-rose-400 text-2xl group-hover:scale-105 transition-transform">
              拼
            </span>
            <span>PinyinMaster</span>
          </button>

          {/* Zone 2: 4-5 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-slate-600 dark:text-slate-400">
            <button
              onClick={() => setActiveTab('studio')}
              className={`transition-colors whitespace-nowrap hover:text-slate-900 dark:hover:text-white ${
                activeTab === 'studio' ? 'text-rose-600 dark:text-rose-400 font-bold border-b-2 border-rose-600 dark:border-rose-400 py-5' : 'py-5'
              }`}
            >
              Học Phát Âm & Flashcard
            </button>
            <button
              onClick={() => setActiveTab('writing')}
              className={`transition-colors whitespace-nowrap hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 ${
                activeTab === 'writing' ? 'text-rose-600 dark:text-rose-400 font-bold border-b-2 border-rose-600 dark:border-rose-400 py-5' : 'py-5'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-rose-500" />
              <span>Tập Viết Chữ Hán</span>
            </button>
            <button
              onClick={() => setActiveTab('chart')}
              className={`transition-colors whitespace-nowrap hover:text-slate-900 dark:hover:text-white ${
                activeTab === 'chart' ? 'text-rose-600 dark:text-rose-400 font-bold border-b-2 border-rose-600 dark:border-rose-400 py-5' : 'py-5'
              }`}
            >
              Bảng Pinyin Toàn Diện
            </button>
            <button
              onClick={() => setActiveTab('listening')}
              className={`transition-colors whitespace-nowrap hover:text-slate-900 dark:hover:text-white ${
                activeTab === 'listening' ? 'text-rose-600 dark:text-rose-400 font-bold border-b-2 border-rose-600 dark:border-rose-400 py-5' : 'py-5'
              }`}
            >
              Bài Tập Luyện Nghe
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`transition-colors whitespace-nowrap hover:text-slate-900 dark:hover:text-white ${
                activeTab === 'daily' ? 'text-rose-600 dark:text-rose-400 font-bold border-b-2 border-rose-600 dark:border-rose-400 py-5' : 'py-5'
              }`}
            >
              Kiểm Tra Hàng Ngày
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`transition-colors whitespace-nowrap hover:text-slate-900 dark:hover:text-white ${
                activeTab === 'rules' ? 'text-rose-600 dark:text-rose-400 font-bold border-b-2 border-rose-600 dark:border-rose-400 py-5' : 'py-5'
              }`}
            >
              Quy Tắc Biến Điệu
            </button>
          </nav>

          {/* Zone 3: Actions (Voice customize, Theme toggle, Daily mission) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Pronunciation voice customize button */}
            <button
              onClick={() => setIsAudioSettingsOpen(true)}
              className="p-2 sm:px-3 sm:py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 rounded-lg transition-all flex items-center gap-1.5 shadow-2xs"
              title="Tùy chỉnh tiếng phát âm (Chọn giọng Nam/Nữ bản xứ, tốc độ, âm lượng, chế độ ngoại tuyến)"
            >
              <Sliders className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span className="hidden sm:inline">Chỉnh Phát Âm</span>
            </button>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 rounded-lg transition-all"
              title={isDarkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Daily challenge primary CTA */}
            <button
              onClick={() => setActiveTab('daily')}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-lg shadow-xs transition-all whitespace-nowrap flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span className="hidden xs:inline">Thử Thách</span>
              <span className="hidden sm:inline">Hôm Nay</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto border-t border-slate-100 dark:border-slate-800 px-3 py-2 gap-2 bg-slate-50/80 dark:bg-slate-900/80">
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'studio' ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Phát Âm & Flashcard
          </button>
          <button
            onClick={() => setActiveTab('writing')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeTab === 'writing' ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <PenTool className="w-3 h-3 text-rose-500" />
            <span>Tập Viết</span>
          </button>
          <button
            onClick={() => setActiveTab('chart')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'chart' ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Bảng Pinyin
          </button>
          <button
            onClick={() => setActiveTab('listening')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'listening' ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Luyện Nghe
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'daily' ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Kiểm Tra Hàng Ngày
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'rules' ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Biến Điệu
          </button>
        </div>
      </header>

      {/* Hero Spotlight Section */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">
              <span>Học tiếng Trung Giản Thể</span>
              <span aria-hidden="true">·</span>
              <span>Chuẩn Ngữ Âm Bắc Kinh</span>
              <span aria-hidden="true">·</span>
              <span>Dành cho người mới bắt đầu</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight max-w-2xl">
              Học Phát Âm Pinyin Chuẩn Xác Với Sơ Đồ Đặt Lưỡi Giải Phẫu
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Minh họa trực quan chuyển động của vòm họng, khẩu hình miệng, luồng hơi bật gió và vị trí đặt lưỡi cho từng phụ âm và nguyên âm. Kèm theo bài tập luyện nghe và chấm điểm phát âm tương tác hàng ngày.
            </p>

            {/* Feature quick badges */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>21 Thanh mẫu & 36 Vận mẫu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Flashcard cặp âm dễ nhầm (b-p, d-t, j-q-x)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Tập viết chữ Hán 8 nét & 7 bút thuận</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900 font-semibold">
                <WifiOff className="w-3.5 h-3.5" />
                <span>100% Ngoại tuyến (Không cần mạng)</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-4 relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm aspect-[16/10] bg-slate-900">
            <img
              src="/src/assets/images/chinese_phonetics_hero_1790435603143.jpg"
              alt="Học phát âm Pinyin tiếng Trung giản thể"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center opacity-90 hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-4">
              <span className="text-xs font-mono font-bold text-rose-300">
                Zhōngwén Pīnyīn · 中文拼音
              </span>
              <p className="text-xs text-slate-200 mt-0.5">
                Nền tảng vững chắc để nói tiếng Trung tự nhiên như người bản xứ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tabbed Interactive Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'studio' && <PronunciationStudio onOpenAudioSettings={() => setIsAudioSettingsOpen(true)} />}
        {activeTab === 'writing' && <HanziWritingGuide />}
        {activeTab === 'chart' && <InteractivePinyinChart />}
        {activeTab === 'listening' && <ListeningExercises />}
        {activeTab === 'daily' && <DailyPronunciationCheck />}
        {activeTab === 'rules' && <RulesHandbook />}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-12 py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">PinyinMaster</span>
            <span>· Nền tảng học phát âm tiếng Trung giản thể chuẩn ngữ âm học</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>IPA Phonetical Guidelines</span>
            <span aria-hidden="true">·</span>
            <span>Hán ngữ tiêu chuẩn (Standard Mandarin)</span>
            <span aria-hidden="true">·</span>
            <span>Tùy chỉnh giọng phát âm Nam/Nữ</span>
            <span aria-hidden="true">·</span>
            <span>Giao diện Sáng / Tối</span>
          </div>
        </div>
      </footer>

      {/* Audio Settings Modal */}
      <AudioSettingsModal
        isOpen={isAudioSettingsOpen}
        onClose={() => setIsAudioSettingsOpen(false)}
      />
    </div>
  );
}
