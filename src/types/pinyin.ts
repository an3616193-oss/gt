export type SoundCategory = 'initial' | 'final' | 'tone';

export type InitialGroup =
  | 'labial'           // b, p, m, f (Âm môi & Răng-môi)
  | 'alveolar'         // d, t, n, l (Âm đầu lưỡi giữa)
  | 'velar'            // g, k, h (Âm gốc lưỡi)
  | 'palatal'          // j, q, x (Âm mặt lưỡi)
  | 'dental-sibilant'  // z, c, s (Âm đầu lưỡi trước)
  | 'retroflex'        // zh, ch, sh, r (Âm uốn lưỡi / đầu lưỡi sau)
  | 'special';         // y, w (Phụ âm đặc biệt)

export type FinalGroup =
  | 'simple'           // a, o, e, i, u, ü (Vận mẫu đơn)
  | 'compound'         // ai, ei, ao, ou, ia, ie, iao, iu, ua, uo, uai, ui, üe (Vận mẫu kép)
  | 'nasal-front'      // an, en, in, ün, ian, uan, üan (Vận mẫu mũi trước -n)
  | 'nasal-back';      // ang, eng, ing, ong, iang, iong, uang, ueng (Vận mẫu mũi sau -ng)

export type AspirationType = 'none' | 'aspirated' | 'voiced' | 'friction' | 'nasal';

export type AnatomyPreset =
  | 'bilabial_closure'          // b
  | 'bilabial_burst_aspirated'  // p
  | 'bilabial_nasal'            // m
  | 'labiodental_friction'      // f
  | 'alveolar_stop_unaspirated' // d
  | 'alveolar_stop_aspirated'   // t
  | 'alveolar_nasal'            // n
  | 'alveolar_lateral'          // l
  | 'velar_stop_unaspirated'    // g
  | 'velar_stop_aspirated'      // k
  | 'velar_fricative'           // h
  | 'palatal_fricative_j'       // j
  | 'palatal_fricative_q'       // q
  | 'palatal_fricative_x'       // x
  | 'dental_sibilant_z'         // z
  | 'dental_sibilant_c'         // c
  | 'dental_sibilant_s'         // s
  | 'retroflex_zh'              // zh
  | 'retroflex_ch'              // ch
  | 'retroflex_sh'              // sh
  | 'retroflex_r'               // r
  | 'vowel_a'
  | 'vowel_o'
  | 'vowel_e'
  | 'vowel_i'
  | 'vowel_u'
  | 'vowel_yu';

export interface SoundExample {
  hanzi: string;
  pinyin: string;
  hanViet: string;
  vietnameseMeaning: string;
  audioText: string;
}

export interface PhoneticSound {
  id: string;
  symbol: string;
  name: string;
  category: SoundCategory;
  group: InitialGroup | FinalGroup;
  ipa: string;
  pedagogicalPronunciation: string;
  pedagogicalHanzi: string;
  vietnameseApprox: string;
  mouthShape: string;
  tonguePosition: string;
  aspiration: AspirationType;
  vocalCordVibration: boolean;
  guideSteps: string[];
  commonMistakeVietnamese: string;
  anatomyPreset: AnatomyPreset;
  examples: SoundExample[];
}

export interface ToneInfo {
  toneNumber: 1 | 2 | 3 | 4 | 0;
  name: string;
  hanziName: string;
  pitchValue: string; // e.g. "55", "35", "214", "51"
  pitchDescription: string;
  description: string;
  vietnameseComparison: string;
  pitchPoints: number[]; // points for SVG curve (0-100 scale: 1=low, 5=high)
  exampleSyllables: Array<{
    pinyin: string;
    hanzi: string;
    meaning: string;
  }>;
}

export interface MinimalPairExercise {
  id: string;
  pairName: string;
  category: 'initial' | 'final' | 'tone';
  soundA: {
    symbol: string;
    pinyin: string;
    hanzi: string;
    meaning: string;
    audio: string;
  };
  soundB: {
    symbol: string;
    pinyin: string;
    hanzi: string;
    meaning: string;
    audio: string;
  };
  explanation: string;
}

export interface ListeningQuizQuestion {
  id: string;
  type: 'minimal_pair' | 'tone_guess' | 'pinyin_match' | 'meaning_match';
  title: string;
  instruction: string;
  audioTarget: string;
  audioPinyin: string;
  options: Array<{
    id: string;
    label: string;
    subLabel?: string;
    isCorrect: boolean;
  }>;
  explanation: string;
}

export interface DailyChallengeItem {
  id: string;
  hanzi: string;
  pinyin: string;
  hanViet: string;
  vietnameseMeaning: string;
  targetInitial?: string;
  targetFinal?: string;
  targetTone?: number;
  tip: string;
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
}

export interface UserStats {
  streakDays: number;
  lastPracticeDate: string;
  completedDailyDates: string[];
  totalScore: number;
  audioPracticesCount: number;
  quizzesCompletedCount: number;
}
