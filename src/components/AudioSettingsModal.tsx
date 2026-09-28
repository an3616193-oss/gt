import React, { useState, useEffect } from 'react';
import {
  audioService,
  AVAILABLE_VOICES,
  AudioSettings,
  VoiceOptionId,
} from '../utils/audio';
import {
  Volume2,
  Sliders,
  X,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  UserCheck,
  Gauge,
  BookOpen,
} from 'lucide-react';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<AudioSettings>(() => audioService.getSettings());
  const [isTestingVoice, setIsTestingVoice] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(audioService.getSettings());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdate = (partial: Partial<AudioSettings>) => {
    const updated = audioService.updateSettings(partial);
    setSettings(updated);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleTestVoice = async (voiceId: VoiceOptionId) => {
    setIsTestingVoice(voiceId);
    await audioService.testVoice(voiceId);
    setIsTestingVoice(null);
  };

  const handleResetDefaults = () => {
    handleUpdate({
      voiceName: 'Kore',
      speed: 0.85,
      pronunciationMode: 'pedagogical',
      volume: 1.0,
    });
  };

  const speedPresets = [
    { label: '0.6x (Rất chậm)', value: 0.6 },
    { label: '0.75x (Chậm)', value: 0.75 },
    { label: '0.85x (Chuẩn học)', value: 0.85 },
    { label: '1.0x (Tự nhiên)', value: 1.0 },
    { label: '1.2x (Nhanh)', value: 1.2 },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                Tùy Chỉnh Tiếng Phát Âm Pinyin
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lựa chọn giọng đọc Nam/Nữ bản xứ, tốc độ và chế độ phát âm theo ý bạn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm">
          {/* Section 1: Voice Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>1. Chọn Giọng Bản Xứ (Voice Selection)</span>
              </label>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Bấm loa để nghe thử từng giọng
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {AVAILABLE_VOICES.map((voice) => {
                const isSelected = settings.voiceName === voice.id;
                const isPlayingThis = isTestingVoice === voice.id;

                return (
                  <div
                    key={voice.id}
                    onClick={() => handleUpdate({ voiceName: voice.id })}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-rose-600 dark:border-rose-500 bg-rose-50/60 dark:bg-rose-950/40 ring-2 ring-rose-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 bg-white dark:bg-slate-800/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                            {voice.name}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              voice.gender === 'female'
                                ? 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300'
                                : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                            }`}
                          >
                            {voice.tag}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                        {voice.description}
                      </p>
                      <div className="text-[11px] text-rose-700 dark:text-rose-300 font-medium mt-1">
                        🎯 {voice.recommendedFor}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                        Model: {voice.id}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestVoice(voice.id);
                        }}
                        disabled={isPlayingThis}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
                      >
                        <Volume2
                          className={`w-3.5 h-3.5 ${isPlayingThis ? 'animate-bounce text-rose-600' : ''}`}
                        />
                        <span>{isPlayingThis ? 'Đang phát...' : 'Thử giọng'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Speed Presets */}
          <div>
            <label className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
              <Gauge className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>2. Tốc Độ Phát Âm (Playback Speed)</span>
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Người mới bắt đầu nên chọn <strong>0.75x hoặc 0.85x</strong> để nghe rõ từng bước mở khẩu hình và phân biệt âm bật hơi.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {speedPresets.map((preset) => {
                const isSelected = settings.speed === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => handleUpdate({ speed: preset.value })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                      isSelected
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Pronunciation Mode */}
          <div>
            <label className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>3. Chế Độ Đọc Thanh Mẫu (Initial Pronunciation Style)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => handleUpdate({ pronunciationMode: 'pedagogical' })}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  settings.pronunciationMode === 'pedagogical'
                    ? 'border-rose-600 dark:border-rose-500 bg-rose-50/60 dark:bg-rose-950/40 ring-2 ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Âm gọi quy chuẩn sư phạm (Khuyên dùng)
                  </span>
                  {settings.pronunciationMode === 'pedagogical' && (
                    <Check className="w-4 h-4 text-rose-600 dark:text-rose-400 stroke-[3]" />
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Đọc kèm nguyên âm đệm chuẩn như trường học Bắc Kinh: <code className="text-rose-600 dark:text-rose-400 font-bold">b → bō (玻)</code>, <code className="text-rose-600 dark:text-rose-400 font-bold">p → pō (坡)</code>, <code className="text-rose-600 dark:text-rose-400 font-bold">d → dē (得)</code>.
                </p>
              </div>

              <div
                onClick={() => handleUpdate({ pronunciationMode: 'pure' })}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  settings.pronunciationMode === 'pure'
                    ? 'border-rose-600 dark:border-rose-500 bg-rose-50/60 dark:bg-rose-950/40 ring-2 ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Âm nguyên bản trực tiếp
                  </span>
                  {settings.pronunciationMode === 'pure' && (
                    <Check className="w-4 h-4 text-rose-600 dark:text-rose-400 stroke-[3]" />
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Phát âm trực tiếp ký tự Pinyin, tập trung vào luồng hơi mộc của phụ âm.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Volume Control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>4. Âm Lượng (Volume)</span>
              </label>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                {Math.round(settings.volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={settings.volume}
              onChange={(e) => handleUpdate({ volume: parseFloat(e.target.value) })}
              className="w-full accent-rose-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Section 5: Offline Mode (Không cần mạng) */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>5. Hoạt động Ngoại tuyến (100% Offline)</span>
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Phát âm trực tiếp bằng bộ máy giọng nói trình duyệt, không gửi yêu cầu qua mạng, phản hồi tức thì.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleUpdate({ offlineOnly: !settings.offlineOnly })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  settings.offlineOnly ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    settings.offlineOnly ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{settings.offlineOnly ? 'Đang bật chế độ hoàn toàn ngoại tuyến' : 'Tự động (Ưu tiên ngoại tuyến khi mất mạng)'}</span>
            </div>
          </div>

          {/* Section 6: Quick Test Playground */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                Nghe thử ngay với cấu hình vừa chọn:
              </span>
              {savedToast && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 animate-pulse">
                  <Check className="w-3.5 h-3.5" /> Đã cập nhật
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: 'Âm "bō" (玻)', text: 'b', pedagogical: '玻' },
                { label: 'Âm "pō" (坡 - Bật hơi)', text: 'p', pedagogical: '坡' },
                { label: 'Âm "zhī" (知 - Uốn lưỡi)', text: 'zh', pedagogical: '知' },
                { label: 'Âm "qī" (七 - Bật hơi)', text: 'q', pedagogical: '七' },
                { label: 'Từ "Hǎo" (好 - Tốt)', text: 'hǎo', pedagogical: '好' },
                { label: 'Từ "Xièxie" (谢谢 - Cảm ơn)', text: 'xièxie', pedagogical: '谢谢' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => audioService.speakChinese(item.text, { pedagogicalText: item.pedagogical })}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-500 hover:text-rose-600 dark:hover:text-rose-400 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 text-rose-600 dark:text-rose-400 fill-rose-600 dark:fill-rose-400" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục mặc định</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all"
          >
            Hoàn Tất & Lưu Cài Đặt
          </button>
        </div>
      </div>
    </div>
  );
};
