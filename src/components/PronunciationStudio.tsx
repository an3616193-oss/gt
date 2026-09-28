import React, { useState, useEffect } from 'react';
import { INITIALS_DATA, SIMPLE_FINALS } from '../data/pinyinData';
import { PhoneticSound } from '../types/pinyin';
import { VocalTractAnatomy } from './VocalTractAnatomy';
import { ToneGuideVisualizer } from './ToneGuideVisualizer';
import { audioService, AudioSettings } from '../utils/audio';
import { speechEvaluator, RecognitionResult } from '../utils/speechRecognition';
import { PronunciationFlashcards } from './PronunciationFlashcards';
import {
  Volume2,
  Mic,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Sliders,
  Layers,
} from 'lucide-react';

interface PronunciationStudioProps {
  onOpenAudioSettings?: () => void;
}

export const PronunciationStudio: React.FC<PronunciationStudioProps> = ({ onOpenAudioSettings }) => {
  const [activeCategory, setActiveCategory] = useState<'initials' | 'finals' | 'tones' | 'flashcards'>('initials');
  const [selectedSound, setSelectedSound] = useState<PhoneticSound>(INITIALS_DATA[0]);
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() => audioService.getSettings());
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Micro test states
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);

  useEffect(() => {
    return audioService.subscribeSettings((newSettings) => {
      setAudioSettings(newSettings);
    });
  }, []);

  const soundsList = activeCategory === 'initials' ? INITIALS_DATA : SIMPLE_FINALS;

  const handlePlaySound = async (sound: PhoneticSound) => {
    setIsSpeaking(true);
    await audioService.speakChinese(sound.symbol, {
      pedagogicalText: sound.pedagogicalHanzi,
      rate: audioSettings.speed,
    });
    setIsSpeaking(false);
  };

  const handlePlayWord = async (hanziText: string) => {
    setIsSpeaking(true);
    await audioService.speakChinese(hanziText, {
      rate: audioSettings.speed,
    });
    setIsSpeaking(false);
  };

  const handleTestSpeech = async (targetHanzi: string, targetPinyin: string) => {
    setIsRecording(true);
    setRecognitionResult(null);

    const result = await speechEvaluator.listenAndEvaluate(
      targetHanzi,
      targetPinyin,
      (state) => {
        if (state === 'idle') setIsRecording(false);
      }
    );

    setIsRecording(false);
    setRecognitionResult(result);
    if (result.isMatch) {
      audioService.playSuccessChime();
    } else {
      audioService.playErrorBeep();
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Navigation & Voice Settings Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg overflow-x-auto">
          <button
            onClick={() => {
              setActiveCategory('initials');
              setSelectedSound(INITIALS_DATA[0]);
              setRecognitionResult(null);
            }}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all whitespace-nowrap ${
              activeCategory === 'initials'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            21 Thanh Mẫu (Phụ âm)
          </button>
          <button
            onClick={() => {
              setActiveCategory('finals');
              setSelectedSound(SIMPLE_FINALS[0]);
              setRecognitionResult(null);
            }}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all whitespace-nowrap ${
              activeCategory === 'finals'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            6 Vận Mẫu Đơn (Nguyên âm)
          </button>
          <button
            onClick={() => {
              setActiveCategory('tones');
              setRecognitionResult(null);
            }}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all whitespace-nowrap ${
              activeCategory === 'tones'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            4 Thanh Điệu (Dấu giọng)
          </button>
          <button
            onClick={() => {
              setActiveCategory('flashcards');
              setRecognitionResult(null);
            }}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeCategory === 'flashcards'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-300" />
            <span>Flashcard Cặp Âm (b-p, d-t, j-q-x...)</span>
            <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
              Mới
            </span>
          </button>
        </div>

        {/* Audio Voice & Speed Badge / Action Button */}
        {onOpenAudioSettings && (
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={onOpenAudioSettings}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all border border-slate-200/60 dark:border-slate-700 shadow-2xs group"
              title="Nhấp để thay đổi giọng đọc Nam/Nữ, tốc độ và chế độ phát âm"
            >
              <Sliders className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 group-hover:rotate-45 transition-transform" />
              <span>
                Giọng: <strong className="text-rose-600 dark:text-rose-400">{audioSettings.voiceName}</strong> · {audioSettings.speed}x
              </span>
              <span className="text-[11px] text-rose-600 dark:text-rose-400 underline font-bold ml-0.5">
                Chỉnh phát âm
              </span>
            </button>
          </div>
        )}
      </div>

      {activeCategory === 'flashcards' ? (
        <PronunciationFlashcards />
      ) : activeCategory === 'tones' ? (
        <ToneGuideVisualizer />
      ) : (
        <>
          {/* Sound Selector Buttons Grid */}
          <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Chọn âm để xem vị trí đặt lưỡi & cách phát âm:
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {activeCategory === 'initials' ? '21 thanh mẫu + 2 bán nguyên âm' : '6 nguyên âm cơ sở'}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {soundsList.map((sound) => {
                const isSelected = selectedSound.id === sound.id;
                const isAspirated = sound.aspiration === 'aspirated';
                return (
                  <button
                    key={sound.id}
                    onClick={() => {
                      setSelectedSound(sound);
                      setRecognitionResult(null);
                      handlePlaySound(sound);
                    }}
                    className={`min-w-10 sm:min-w-12 h-10 sm:h-11 px-2.5 rounded-lg font-mono font-bold text-sm sm:text-base flex flex-col items-center justify-center transition-all relative ${
                      isSelected
                        ? 'bg-rose-600 dark:bg-rose-600 text-white shadow-sm ring-2 ring-rose-600 ring-offset-2 dark:ring-offset-slate-900'
                        : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>{sound.symbol}</span>
                    {isAspirated && (
                      <span
                        className={`text-[9px] -mt-1 font-sans ${
                          isSelected ? 'text-rose-200' : 'text-amber-600 dark:text-amber-400 font-bold'
                        }`}
                        title="Âm bật hơi"
                      >
                        bật hơi
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Interactive Pronunciation Console */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 6 cols: Anatomical Cross Section & Visual Position */}
            <div className="lg:col-span-6 space-y-4">
              <VocalTractAnatomy
                preset={selectedSound.anatomyPreset}
                soundSymbol={selectedSound.symbol}
                aspiration={selectedSound.aspiration}
                vocalCordVibration={selectedSound.vocalCordVibration}
                mouthShape={selectedSound.mouthShape}
                tonguePosition={selectedSound.tonguePosition}
              />

              {/* Vietnamese learner's pitfall box */}
              <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl p-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-950 dark:text-amber-200 font-bold block mb-1">
                      Bẫy phát âm người Việt thường mắc:
                    </strong>
                    <p className="text-amber-900 dark:text-amber-300 leading-relaxed">
                      {selectedSound.commonMistakeVietnamese}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 6 cols: Step-by-Step Tuition, Audio & Speech Test */}
            <div className="lg:col-span-6 space-y-5">
              {/* Sound Summary Card */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-3xl sm:text-4xl font-mono font-extrabold text-rose-600 dark:text-rose-400">
                        /{selectedSound.symbol}/
                      </span>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        IPA: {selectedSound.ipa}
                      </span>
                      <span className="text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
                        <span className="text-slate-500 dark:text-slate-400">Âm gọi chuẩn:</span>
                        <strong className="font-mono text-sm font-bold text-rose-600 dark:text-rose-400">{selectedSound.pedagogicalPronunciation}</strong>
                        <span className="font-hanzi text-sm font-medium">({selectedSound.pedagogicalHanzi})</span>
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-2">
                      {selectedSound.vietnameseApprox}
                    </p>
                  </div>

                  <button
                    onClick={() => handlePlaySound(selectedSound)}
                    disabled={isSpeaking}
                    className="p-3 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl shadow-xs transition-all flex items-center gap-2 text-xs font-semibold self-start shrink-0"
                    title="Bấm để nghe phát âm mẫu chuẩn xác"
                  >
                    <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
                    <span>{isSpeaking ? 'Đang phát...' : 'Nghe âm mẫu chuẩn'}</span>
                  </button>
                </div>

                {/* 3 Step Positioning Guide */}
                <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    3 bước đặt lưỡi & mở khẩu hình chuẩn:
                  </h4>
                  <div className="space-y-2">
                    {selectedSound.guideSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                        <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Word Examples & Live Speech Checker */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    Từ vựng ứng dụng & Thử giọng:
                  </h4>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Bấm loa để nghe · Bấm mic để nói thử
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedSound.examples.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-hanzi font-bold text-slate-900 dark:text-slate-100">
                          {item.hanzi}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                              {item.pinyin}
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500">
                              (Hán Việt: {item.hanViet})
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                            {item.vietnameseMeaning}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Audio play button */}
                        <button
                          onClick={() => handlePlayWord(item.audioText)}
                          className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 text-slate-700 dark:text-slate-300 transition-colors"
                          title="Nghe phát âm từ này"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>

                        {/* Speech test button */}
                        <button
                          onClick={() => handleTestSpeech(item.hanzi, item.pinyin)}
                          disabled={isRecording}
                          className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 transition-colors"
                          title="Bấm và nói từ này vào micro"
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Speech Recognition Feedback Panel */}
                {isRecording && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg text-xs text-blue-800 dark:text-blue-200 flex items-center gap-2 animate-pulse">
                    <Mic className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-bounce" />
                    <span>Đang lắng nghe... Hãy phát âm từ trên rõ ràng vào mic!</span>
                  </div>
                )}

                {recognitionResult && !isRecording && (
                  <div
                    className={`mt-4 p-3.5 rounded-lg border text-xs ${
                      recognitionResult.isMatch
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
                        : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        {recognitionResult.isMatch ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        )}
                        <span>
                          {recognitionResult.isMatch
                            ? 'Phát âm chuẩn xác!'
                            : 'Cần điều chỉnh thêm'}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-sm">
                        Điểm: {recognitionResult.score}/100
                      </span>
                    </div>
                    <p className="mt-1 leading-relaxed">{recognitionResult.feedback}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
