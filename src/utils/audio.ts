/**
 * Audio synthesis engine for Mandarin Chinese Pinyin learning.
 * Prioritizes high-fidelity, studio-grade native Mandarin pronunciation
 * via server-side Gemini TTS (`gemini-3.8-flash-lite-tts`) with instant memory caching,
 * and seamlessly falls back to mapped Web Speech API with standard pedagogical Chinese characters.
 */

// Pinyin initial to pedagogical standard pronunciation and character
export const INITIAL_PEDAGOGICAL_MAP: Record<string, { pinyin: string; hanzi: string }> = {
  b: { pinyin: 'bō', hanzi: '玻' },
  p: { pinyin: 'pō', hanzi: '坡' },
  m: { pinyin: 'mō', hanzi: '摸' },
  f: { pinyin: 'fō', hanzi: '佛' },
  d: { pinyin: 'dē', hanzi: '得' },
  t: { pinyin: 'tē', hanzi: '特' },
  n: { pinyin: 'nē', hanzi: '讷' },
  l: { pinyin: 'lē', hanzi: '勒' },
  g: { pinyin: 'gē', hanzi: '哥' },
  k: { pinyin: 'kē', hanzi: '科' },
  h: { pinyin: 'hē', hanzi: '喝' },
  j: { pinyin: 'jī', hanzi: '鸡' },
  q: { pinyin: 'qī', hanzi: '七' },
  x: { pinyin: 'xī', hanzi: '西' },
  zh: { pinyin: 'zhī', hanzi: '知' },
  ch: { pinyin: 'chī', hanzi: '吃' },
  sh: { pinyin: 'shī', hanzi: '诗' },
  r: { pinyin: 'rì', hanzi: '日' },
  z: { pinyin: 'zī', hanzi: '资' },
  c: { pinyin: 'cī', hanzi: '疵' },
  s: { pinyin: 'sī', hanzi: '思' },
  y: { pinyin: 'yī', hanzi: '衣' },
  w: { pinyin: 'wū', hanzi: '乌' },
  a: { pinyin: 'ā', hanzi: '啊' },
  o: { pinyin: 'ō', hanzi: '喔' },
  e: { pinyin: 'ē', hanzi: '鹅' },
  i: { pinyin: 'yī', hanzi: '衣' },
  u: { pinyin: 'wū', hanzi: '乌' },
  ü: { pinyin: 'yǖ', hanzi: '迂' },
  // Compound & Nasal finals (Vận mẫu kép & vận mẫu mũi)
  ai: { pinyin: 'āi', hanzi: '哀' },
  ei: { pinyin: 'ēi', hanzi: '诶' },
  ao: { pinyin: 'āo', hanzi: '熬' },
  ou: { pinyin: 'ōu', hanzi: '欧' },
  an: { pinyin: 'ān', hanzi: '安' },
  en: { pinyin: 'ēn', hanzi: '恩' },
  ang: { pinyin: 'āng', hanzi: '昂' },
  eng: { pinyin: 'ēng', hanzi: '鞥' },
  ong: { pinyin: 'hōng', hanzi: '轰' },
  ia: { pinyin: 'yā', hanzi: '鸭' },
  ie: { pinyin: 'yē', hanzi: '耶' },
  iao: { pinyin: 'yāo', hanzi: '腰' },
  iu: { pinyin: 'yōu', hanzi: '优' },
  ian: { pinyin: 'yān', hanzi: '烟' },
  in: { pinyin: 'yīn', hanzi: '因' },
  iang: { pinyin: 'yāng', hanzi: '央' },
  ing: { pinyin: 'yīng', hanzi: '英' },
  iong: { pinyin: 'yōng', hanzi: '雍' },
  ua: { pinyin: 'wā', hanzi: '蛙' },
  uo: { pinyin: 'wō', hanzi: '窝' },
  uai: { pinyin: 'wāi', hanzi: '歪' },
  ui: { pinyin: 'wēi', hanzi: '微' },
  uan: { pinyin: 'wān', hanzi: '弯' },
  un: { pinyin: 'wēn', hanzi: '温' },
  uang: { pinyin: 'wāng', hanzi: '汪' },
  ueng: { pinyin: 'wēng', hanzi: '翁' },
  üe: { pinyin: 'yuē', hanzi: '约' },
  üan: { pinyin: 'yuān', hanzi: '冤' },
  ün: { pinyin: 'yūn', hanzi: '晕' },
  er: { pinyin: 'ēr', hanzi: '儿' },
};

export type VoiceOptionId = 'Kore' | 'Zephyr' | 'Puck' | 'Fenrir' | 'Charon';

export interface VoiceOptionInfo {
  id: VoiceOptionId;
  name: string;
  gender: 'female' | 'male';
  tag: string;
  description: string;
  recommendedFor: string;
}

export const AVAILABLE_VOICES: VoiceOptionInfo[] = [
  {
    id: 'Kore',
    name: 'Kore (Nữ Chuẩn Bắc Kinh)',
    gender: 'female',
    tag: 'Tiêu chuẩn',
    description: 'Giọng nữ chuẩn giáo viên phát thanh, âm tiết tròn trịa, thanh điệu rõ ràng chuẩn mực.',
    recommendedFor: 'Khuyên dùng cho người mới bắt đầu',
  },
  {
    id: 'Zephyr',
    name: 'Zephyr (Nữ Thanh Thoát & Tự Nhiên)',
    gender: 'female',
    tag: 'Tự nhiên',
    description: 'Giọng nữ trong trẻo, tự nhiên, nhả âm nhẹ nhàng và tinh tế.',
    recommendedFor: 'Phù hợp luyện phản xạ giao tiếp',
  },
  {
    id: 'Puck',
    name: 'Puck (Nam Sắc Nét & Bật Hơi Rõ)',
    gender: 'male',
    tag: 'Bật hơi rõ',
    description: 'Giọng nam dứt khoát, âm bật hơi mạnh mẽ, nhấn nhá thanh điệu rất nét.',
    recommendedFor: 'Đặc trị luyện phân biệt cặp âm bật hơi p, t, k, q, ch, c',
  },
  {
    id: 'Fenrir',
    name: 'Fenrir (Nam Trầm Ấm & Chuẩn Mực)',
    gender: 'male',
    tag: 'Trầm ấm',
    description: 'Giọng nam trầm ấm, phát âm đĩnh đạc, âm cuốn lưỡi chuẩn xác.',
    recommendedFor: 'Luyện âm cuốn lưỡi zh, ch, sh, r',
  },
  {
    id: 'Charon',
    name: 'Charon (Nam Điềm Đạm & Ổn Định)',
    gender: 'male',
    tag: 'Điềm đạm',
    description: 'Giọng nam điềm đạm, tốc độ vừa phải, ngữ âm vững vàng.',
    recommendedFor: 'Luyện nghe phân biệt thanh 1 và thanh 4',
  },
];

export interface AudioSettings {
  voiceName: VoiceOptionId;
  speed: number; // 0.6, 0.75, 0.85, 1.0, 1.2
  pronunciationMode: 'pedagogical' | 'pure'; // pedagogical (bō) vs pure ([p] / raw)
  volume: number; // 0.1 to 1.0
  offlineOnly?: boolean; // When true, does not make any network request, 100% offline
}

export interface SpeakOptions {
  pedagogicalText?: string;
  voiceName?: VoiceOptionId;
  rate?: number;
  tone?: number;
}

const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  voiceName: 'Kore',
  speed: 0.85,
  pronunciationMode: 'pedagogical',
  volume: 1.0,
  offlineOnly: false,
};

class AudioEngine {
  private ctx: AudioContext | null = null;
  private chineseVoice: SpeechSynthesisVoice | null = null;
  private voiceLoaded = false;
  // Browser memory cache for audio Blobs: URL string mapping
  private audioBlobCache = new Map<string, string>();
  private activeAudio: HTMLAudioElement | null = null;
  private settings: AudioSettings = DEFAULT_AUDIO_SETTINGS;
  private listeners: ((settings: AudioSettings) => void)[] = [];

  constructor() {
    this.loadSettings();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoices();
      };
    }
  }

  private loadSettings() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('pinyin_audio_settings');
      if (saved) {
        this.settings = { ...DEFAULT_AUDIO_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      this.settings = { ...DEFAULT_AUDIO_SETTINGS };
    }
  }

  public getSettings(): AudioSettings {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<AudioSettings>): AudioSettings {
    this.settings = { ...this.settings, ...partial };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('pinyin_audio_settings', JSON.stringify(this.settings));
      } catch {
        // ignore
      }
    }
    this.listeners.forEach((fn) => fn(this.getSettings()));
    return this.getSettings();
  }

  public subscribeSettings(fn: (settings: AudioSettings) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    this.chineseVoice =
      voices.find((v) => v.lang === 'zh-CN') ||
      voices.find((v) => v.lang.startsWith('zh')) ||
      voices.find((v) => v.name.toLowerCase().includes('chinese')) ||
      null;
    this.voiceLoaded = true;
  }

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Determine the most natural Mandarin pedagogical target for pronunciation
   */
  public resolvePedagogicalTarget(input: string, explicitPedagogical?: string): string {
    if (explicitPedagogical) return explicitPedagogical;
    const clean = input.trim().toLowerCase();
    if (INITIAL_PEDAGOGICAL_MAP[clean]) {
      return INITIAL_PEDAGOGICAL_MAP[clean].hanzi;
    }
    return input;
  }

  /**
   * Speak Chinese text with native Mandarin authenticity.
   * Attempts server-side Gemini TTS first, with instant client memory cache,
   * falling back to Web Speech API.
   */
  public async speakChinese(text: string, options?: number | SpeakOptions): Promise<void> {
    const opts: SpeakOptions = typeof options === 'number' ? { rate: options } : options || {};
    const rate = opts.rate ?? this.settings.speed;
    const voiceName = opts.voiceName ?? this.settings.voiceName;

    // Stop any existing playing audio
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const pedagogicalText = this.resolvePedagogicalTarget(text, opts.pedagogicalText);
    const cacheKey = `${text}_${pedagogicalText}_${voiceName}_${opts.tone ?? ''}`;

    // 1. Check if we already have an object URL cached in browser memory
    if (this.audioBlobCache.has(cacheKey)) {
      const cachedUrl = this.audioBlobCache.get(cacheKey)!;
      return this.playAudioUrl(cachedUrl, rate);
    }

    // Check if device is explicitly offline or user enabled offline-only mode
    const isOffline = (typeof navigator !== 'undefined' && !navigator.onLine) || Boolean(this.settings.offlineOnly);

    // 2. Try server-side Gemini Studio TTS ONLY IF ONLINE and not in offlineOnly mode
    if (!isOffline) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 800); // 800ms fast abort if no network

        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            text,
            pedagogicalText,
            voiceName,
            tone: opts.tone,
          }),
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data.audioBase64) {
            const binary = atob(data.audioBase64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
              bytes[i] = binary.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
            const audioUrl = URL.createObjectURL(blob);
            this.audioBlobCache.set(cacheKey, audioUrl);
            return this.playAudioUrl(audioUrl, rate);
          }
        }
      } catch {
        // Network unavailable or server offline, fall through immediately
      }
    }

    // 3. Fallback to 100% offline Web Speech API with mapped pedagogical Chinese character
    return this.fallbackWebSpeech(pedagogicalText || text, rate);
  }

  /**
   * Test a specific voice with a clean standard syllable
   */
  public async testVoice(voiceName?: VoiceOptionId): Promise<void> {
    const v = voiceName || this.settings.voiceName;
    return this.speakChinese('hǎo', { pedagogicalText: '好', voiceName: v, rate: this.settings.speed });
  }

  private playAudioUrl(url: string, rate = 1.0): Promise<void> {
    return new Promise((resolve) => {
      try {
        const audio = new Audio(url);
        this.activeAudio = audio;
        audio.volume = Math.max(0, Math.min(1, this.settings.volume));
        audio.playbackRate = Math.min(1.5, Math.max(0.5, rate));
        audio.onended = () => {
          this.activeAudio = null;
          resolve();
        };
        audio.onerror = () => {
          this.activeAudio = null;
          resolve();
        };
        audio.play().catch(() => resolve());
      } catch {
        resolve();
      }
    });
  }

  private fallbackWebSpeech(text: string, rate = 0.85): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = rate;
      utterance.volume = Math.max(0, Math.min(1, this.settings.volume));

      // Pitch adjustment based on selected gender
      const isMale = ['Puck', 'Fenrir', 'Charon'].includes(this.settings.voiceName);
      utterance.pitch = isMale ? 0.82 : 1.05;

      if (!this.voiceLoaded) {
        this.initVoices();
      }

      // Try to find a gender-matching Chinese voice if multiple are present in browser
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        const zhVoices = voices.filter((v) => v.lang === 'zh-CN' || v.lang.startsWith('zh'));
        if (zhVoices.length > 0) {
          const matchGender = zhVoices.find((v) => {
            const name = v.name.toLowerCase();
            return isMale
              ? name.includes('male') || name.includes('man') || name.includes('kangkang') || name.includes('bo')
              : name.includes('female') || name.includes('woman') || name.includes('huihui') || name.includes('yaoyao');
          });
          utterance.voice = matchGender || zhVoices[0];
        }
      }

      const timeout = setTimeout(() => {
        resolve();
      }, 3500);

      utterance.onend = () => {
        clearTimeout(timeout);
        resolve();
      };
      utterance.onerror = () => {
        clearTimeout(timeout);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Pure tone synthesis using Web Audio API (Chao 5-level pitch contour)
   * 1 = 55 (Cao bằng)
   * 2 = 35 (Lên cao)
   * 3 = 214 (Xuống rồi lên)
   * 4 = 51 (Rơi mạnh)
   */
  public playToneContour(tone: 1 | 2 | 3 | 4 | 0, baseFreq = 260): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);

      if (tone === 1) {
        // Flat high: 5-5
        const f = baseFreq * 1.35;
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.setValueAtTime(f, now + 0.45);
        gain.gain.setValueAtTime(0.2, now + 0.4);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.52);
      } else if (tone === 2) {
        // Rising: 3-5
        const fStart = baseFreq * 1.0;
        const fEnd = baseFreq * 1.35;
        osc.frequency.setValueAtTime(fStart, now);
        osc.frequency.exponentialRampToValueAtTime(fEnd, now + 0.45);
        gain.gain.setValueAtTime(0.2, now + 0.4);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.52);
      } else if (tone === 3) {
        // Dipping: 2-1-4
        const fStart = baseFreq * 0.95;
        const fDip = baseFreq * 0.72;
        const fRise = baseFreq * 1.15;
        osc.frequency.setValueAtTime(fStart, now);
        osc.frequency.exponentialRampToValueAtTime(fDip, now + 0.22);
        osc.frequency.exponentialRampToValueAtTime(fRise, now + 0.55);
        gain.gain.setValueAtTime(0.2, now + 0.5);
        gain.gain.linearRampToValueAtTime(0, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.62);
      } else if (tone === 4) {
        // Falling: 5-1
        const fStart = baseFreq * 1.4;
        const fEnd = baseFreq * 0.75;
        osc.frequency.setValueAtTime(fStart, now);
        osc.frequency.exponentialRampToValueAtTime(fEnd, now + 0.32);
        gain.gain.setValueAtTime(0.2, now + 0.28);
        gain.gain.linearRampToValueAtTime(0, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.38);
      } else {
        // Neutral: short, mid
        const f = baseFreq * 0.9;
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.15, now + 0.08);
        gain.gain.linearRampToValueAtTime(0, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.18);
      }
    } catch {
      // Audio context might fail in silent policy
    }
  }

  /**
   * Sound effect: Success chime
   */
  public playSuccessChime(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Sound effect: Error gentle buzz
   */
  public playErrorBeep(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch {
      // ignore
    }
  }
}

export const audioService = new AudioEngine();
