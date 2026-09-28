import React, { useState } from 'react';
import { AnatomyPreset, AspirationType } from '../types/pinyin';
import { Wind, Volume2, Sparkles, Eye, Info } from 'lucide-react';

interface VocalTractAnatomyProps {
  preset: AnatomyPreset;
  soundSymbol: string;
  aspiration: AspirationType;
  vocalCordVibration: boolean;
  mouthShape: string;
  tonguePosition: string;
}

export const VocalTractAnatomy: React.FC<VocalTractAnatomyProps> = ({
  preset,
  soundSymbol,
  aspiration,
  vocalCordVibration,
  mouthShape,
  tonguePosition,
}) => {
  const [showLabels, setShowLabels] = useState(true);
  const [activeTab, setActiveTab] = useState<'sagittal' | 'frontal'>('sagittal');

  // SVG Tongue Paths for each articulation category:
  // Base coordinate system: viewBox 0 0 420 380
  // Hard palate at ~ (210, 150) -> (250, 160)
  // Alveolar ridge at ~ (175, 160)
  // Upper incisors at ~ (145, 175)
  // Lower incisors at ~ (145, 205)
  // Lips at ~ (120, 175) and (120, 215)
  // Soft palate / velum at ~ (260, 175) -> (280, 205)
  // Pharynx wall at ~ (320, 210) down to (320, 320)
  // Vocal cords at ~ (290, 335)

  // Tongue SVG path configurations
  const getTonguePath = (type: AnatomyPreset): string => {
    switch (type) {
      // 1. Retroflex: zh, ch, sh, r (Đầu lưỡi uốn cong lên ngạc cứng)
      case 'retroflex_zh':
      case 'retroflex_ch':
      case 'retroflex_sh':
      case 'retroflex_r':
        return `M 285 320 C 275 270, 255 240, 220 220 C 190 200, 175 190, 185 155 C 190 145, 205 145, 210 160 C 220 185, 235 210, 270 230 C 290 245, 295 285, 298 320 Z`;

      // 2. Dental sibilants: z, c, s (Đầu lưỡi thẳng áp vào chân răng trước)
      case 'dental_sibilant_z':
      case 'dental_sibilant_c':
      case 'dental_sibilant_s':
        return `M 285 320 C 275 270, 260 230, 230 220 C 195 210, 170 205, 150 185 C 145 180, 148 175, 155 178 C 175 188, 200 200, 240 215 C 280 230, 290 280, 298 320 Z`;

      // 3. Palatal: j, q, x (Mặt lưỡi nâng cao áp sát ngạc cứng, đầu lưỡi hạ thấp sau răng dưới)
      case 'palatal_fricative_j':
      case 'palatal_fricative_q':
      case 'palatal_fricative_x':
        return `M 285 320 C 275 260, 255 210, 220 170 C 205 155, 185 160, 160 195 C 150 205, 148 215, 154 215 C 170 215, 195 210, 230 225 C 270 240, 288 280, 298 320 Z`;

      // 4. Velar: g, k, h (Cuống lưỡi nâng cao chạm vòm ngạc mềm)
      case 'velar_stop_unaspirated':
      case 'velar_stop_aspirated':
      case 'velar_fricative':
        return `M 285 320 C 280 270, 275 220, 265 180 C 260 170, 248 172, 235 190 C 210 220, 180 225, 160 220 C 150 218, 152 225, 160 230 C 190 245, 230 245, 260 250 C 285 265, 292 290, 298 320 Z`;

      // 5. Alveolar: d, t, n, l (Đầu lưỡi chạm nướu / lợi trên)
      case 'alveolar_stop_unaspirated':
      case 'alveolar_stop_aspirated':
      case 'alveolar_nasal':
      case 'alveolar_lateral':
        return `M 285 320 C 275 260, 250 225, 220 205 C 195 190, 180 180, 172 165 C 170 160, 176 158, 182 165 C 195 180, 220 195, 250 215 C 280 235, 290 275, 298 320 Z`;

      // 6. Bilabial: b, p, m (Lưỡi thả lỏng tự nhiên, 2 môi khép)
      case 'bilabial_closure':
      case 'bilabial_burst_aspirated':
      case 'bilabial_nasal':
      case 'labiodental_friction':
        return `M 285 320 C 275 260, 245 225, 215 215 C 185 205, 165 210, 155 215 C 148 218, 152 225, 165 228 C 195 235, 225 240, 255 245 C 280 260, 290 285, 298 320 Z`;

      // 7. Vowels
      case 'vowel_a': // miệng mở rộng, lưỡi hạ thấp
        return `M 285 320 C 270 265, 240 245, 210 240 C 180 235, 160 235, 150 238 C 145 240, 150 246, 160 248 C 190 252, 225 255, 255 260 C 280 275, 292 295, 298 320 Z`;
      case 'vowel_i': // lưỡi nâng cao phía trước
        return `M 285 320 C 270 255, 245 205, 210 170 C 195 160, 175 165, 160 190 C 152 200, 155 210, 165 210 C 195 210, 230 220, 260 235 C 280 255, 290 285, 298 320 Z`;
      case 'vowel_u': // lưỡi nâng cao phía sau
      case 'vowel_o':
        return `M 285 320 C 280 260, 270 200, 255 180 C 245 170, 235 178, 220 200 C 195 225, 170 230, 155 228 C 148 227, 152 235, 165 238 C 200 245, 235 245, 265 255 C 285 270, 292 295, 298 320 Z`;
      case 'vowel_e':
        return `M 285 320 C 275 260, 260 215, 240 195 C 225 185, 210 195, 190 210 C 170 225, 155 225, 148 225 C 144 227, 150 235, 160 238 C 190 245, 225 245, 255 252 C 280 270, 290 290, 298 320 Z`;
      case 'vowel_yu': // ü: lưỡi trước cao, môi tròn chúm
        return `M 285 320 C 270 255, 245 205, 210 170 C 195 160, 175 165, 160 190 C 152 200, 155 210, 165 210 C 195 210, 230 220, 260 235 C 280 255, 290 285, 298 320 Z`;
      default:
        return `M 285 320 C 275 260, 245 225, 215 215 C 185 205, 165 210, 155 215 C 148 218, 152 225, 165 228 C 195 235, 225 240, 255 245 C 280 260, 290 285, 298 320 Z`;
    }
  };

  // Whether lips are closed or labiodental
  const isBilabialClosed =
    preset === 'bilabial_closure' ||
    preset === 'bilabial_burst_aspirated' ||
    preset === 'bilabial_nasal';

  const isLabiodental = preset === 'labiodental_friction';
  const isRoundedMouth =
    preset === 'vowel_u' || preset === 'vowel_o' || preset === 'vowel_yu';
  const isNasal =
    preset === 'bilabial_nasal' || preset === 'alveolar_nasal';

  // Contact highlight coordinates based on preset
  const getContactPoint = (type: AnatomyPreset) => {
    switch (type) {
      case 'retroflex_zh':
      case 'retroflex_ch':
      case 'retroflex_sh':
      case 'retroflex_r':
        return { x: 195, y: 155, label: 'Đầu lưỡi uốn chạm/tiệm cận ngạc cứng' };
      case 'dental_sibilant_z':
      case 'dental_sibilant_c':
      case 'dental_sibilant_s':
        return { x: 150, y: 180, label: 'Đầu lưỡi áp chân răng trước' };
      case 'palatal_fricative_j':
      case 'palatal_fricative_q':
      case 'palatal_fricative_x':
        return { x: 210, y: 165, label: 'Mặt lưỡi ép sát ngạc cứng' };
      case 'velar_stop_unaspirated':
      case 'velar_stop_aspirated':
      case 'velar_fricative':
        return { x: 260, y: 178, label: 'Cuống lưỡi nâng chạm ngạc mềm' };
      case 'alveolar_stop_unaspirated':
      case 'alveolar_stop_aspirated':
      case 'alveolar_nasal':
      case 'alveolar_lateral':
        return { x: 174, y: 162, label: 'Đầu lưỡi chạm nướu răng trên' };
      case 'bilabial_closure':
      case 'bilabial_burst_aspirated':
      case 'bilabial_nasal':
        return { x: 118, y: 192, label: 'Hai môi khép chặt hoàn toàn' };
      case 'labiodental_friction':
        return { x: 136, y: 190, label: 'Răng trên cắn nhẹ môi dưới' };
      default:
        return null;
    }
  };

  const contact = getContactPoint(preset);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs transition-colors">
      {/* Top Controller Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
            Sơ đồ phát âm: <span className="text-rose-600 dark:text-rose-400 font-mono text-base font-bold">/{soundSymbol}/</span>
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">· Giải phẫu ngữ âm</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 bg-slate-200/70 dark:bg-slate-700/60 rounded-md text-xs">
            <button
              onClick={() => setActiveTab('sagittal')}
              className={`px-2.5 py-1 font-medium rounded transition-colors ${
                activeTab === 'sagittal'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Cắt dọc khoang miệng
            </button>
            <button
              onClick={() => setActiveTab('frontal')}
              className={`px-2.5 py-1 font-medium rounded transition-colors ${
                activeTab === 'frontal'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Khẩu hình môi mặt trước
            </button>
          </div>

          {activeTab === 'sagittal' && (
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`p-1.5 rounded border text-xs font-medium flex items-center gap-1 transition-colors ${
                showLabels
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title="Bật/Tắt chú thích giải phẫu"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chú thích</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Visual Stage */}
      <div className="p-4 sm:p-6 bg-radial from-slate-50/50 dark:from-slate-900 to-white dark:to-slate-950 flex flex-col items-center justify-center min-h-[360px] transition-colors">
        {activeTab === 'sagittal' ? (
          <div className="relative w-full max-w-[460px] aspect-[420/360]">
            <svg
              viewBox="0 0 420 360"
              className="w-full h-full drop-shadow-xs select-none"
              aria-label="Sơ đồ giải phẫu cắt dọc khoang miệng phát âm tiếng Trung"
            >
              <defs>
                {/* Gradient for head profile */}
                <linearGradient id="headSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#f1f5f9" />
                </linearGradient>

                {/* Gradient for palate and oral cavity */}
                <linearGradient id="palateGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>

                {/* Tongue Gradient */}
                <linearGradient id="tongueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>

                {/* Airflow gradient */}
                <linearGradient id="airGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
                </linearGradient>

                {/* Pattern for bone structure */}
                <pattern id="boneDots" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#cbd5e1" />
                </pattern>
              </defs>

              {/* 1. Base Skull / Head Profile Contour */}
              <path
                d="M 120 70 C 140 30, 220 20, 280 40 C 340 60, 370 120, 360 200 C 350 260, 340 310, 335 350 L 305 350 C 310 300, 320 230, 315 190 C 310 150, 290 120, 250 110 C 210 100, 160 110, 130 115 Z"
                fill="url(#headSkin)"
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />

              {/* 2. Nasal Cavity (Khoang mũi) */}
              <path
                d="M 115 118 C 105 135, 110 148, 125 155 L 140 155 C 160 130, 200 120, 260 125 C 290 130, 295 160, 285 185 L 265 178 C 240 145, 180 145, 140 162 Z"
                fill="#f1f5f9"
                stroke="#cbd5e1"
                strokeWidth="1.2"
              />

              {/* 3. Hard Palate & Alveolar Ridge (Ngạc cứng & Nướu trên) */}
              <path
                d="M 145 175 C 160 160, 195 150, 245 156 L 255 166 C 210 160, 175 168, 155 182 Z"
                fill="#e2e8f0"
                stroke="#94a3b8"
                strokeWidth="1.5"
              />

              {/* 4. Soft Palate / Velum (Ngạc mềm & Lưỡi gà) */}
              {isNasal ? (
                // Velum lowered for nasal sound (airflow goes into nasal cavity)
                <path
                  d="M 255 166 C 265 172, 275 185, 278 200 C 274 204, 268 200, 265 190 C 260 178, 252 170, 245 156 Z"
                  fill="#f43f5e"
                  opacity="0.85"
                  stroke="#e11d48"
                  strokeWidth="1.2"
                />
              ) : (
                // Velum raised closing nasal port
                <path
                  d="M 255 166 C 270 168, 285 170, 292 178 C 290 184, 280 182, 270 178 C 260 172, 250 168, 245 156 Z"
                  fill="#f43f5e"
                  opacity="0.85"
                  stroke="#e11d48"
                  strokeWidth="1.2"
                />
              )}

              {/* 5. Upper Lip */}
              {isBilabialClosed ? (
                // Upper lip closed firmly down
                <path
                  d="M 125 155 C 110 160, 105 178, 115 190 C 122 190, 130 185, 140 178 Z"
                  fill="#fda4af"
                  stroke="#fb7185"
                  strokeWidth="1.5"
                />
              ) : (
                <path
                  d="M 125 155 C 108 160, 105 172, 115 182 C 124 182, 132 180, 140 176 Z"
                  fill="#fda4af"
                  stroke="#fb7185"
                  strokeWidth="1.5"
                />
              )}

              {/* Upper Incisors (Răng cửa trên) */}
              <rect
                x="142"
                y="173"
                width="8"
                height="12"
                rx="2"
                fill="#ffffff"
                stroke="#64748b"
                strokeWidth="1.2"
              />

              {/* 6. Lower Lip & Chin */}
              {isBilabialClosed ? (
                // Lower lip pressed up against upper lip
                <path
                  d="M 115 190 C 112 205, 118 218, 125 228 C 130 235, 138 238, 145 225 L 140 200 C 130 196, 122 192, 115 190 Z"
                  fill="#fda4af"
                  stroke="#fb7185"
                  strokeWidth="1.5"
                />
              ) : isLabiodental ? (
                // Lower lip tucked back touching upper incisors
                <path
                  d="M 118 198 C 125 190, 138 185, 142 185 C 145 195, 140 215, 130 230 C 122 235, 115 225, 118 198 Z"
                  fill="#fda4af"
                  stroke="#fb7185"
                  strokeWidth="1.5"
                />
              ) : (
                <path
                  d="M 112 196 C 110 210, 115 224, 125 235 C 132 242, 140 238, 145 220 L 142 202 C 132 202, 120 200, 112 196 Z"
                  fill="#fda4af"
                  stroke="#fb7185"
                  strokeWidth="1.5"
                />
              )}

              {/* Lower Incisors (Răng cửa dưới) */}
              <rect
                x="142"
                y="198"
                width="8"
                height="12"
                rx="2"
                fill="#ffffff"
                stroke="#64748b"
                strokeWidth="1.2"
              />

              {/* 7. Pharynx Back Wall (Thành sau họng) */}
              <path
                d="M 292 178 C 300 195, 305 240, 300 290 L 300 340 L 315 340 L 318 280 C 322 230, 318 190, 298 174 Z"
                fill="#fed7aa"
                stroke="#fdba74"
                strokeWidth="1.2"
              />

              {/* 8. Airflow visualization */}
              {aspiration === 'aspirated' && (
                <g className="animate-pulse">
                  <path
                    d="M 155 180 Q 130 180 95 182"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="3.5"
                    strokeDasharray="4 3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 155 174 Q 130 170 100 168"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.5"
                    strokeDasharray="3 3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 155 186 Q 130 190 100 194"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.5"
                    strokeDasharray="3 3"
                    strokeLinecap="round"
                  />
                  {/* Arrowhead */}
                  <polygon points="90,182 100,177 100,187" fill="#0284c7" />
                </g>
              )}

              {aspiration === 'friction' && (
                <g className="opacity-90">
                  <path
                    d="M 160 178 Q 140 180 115 185"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeDasharray="2 3"
                    strokeLinecap="round"
                  />
                  <polygon points="110,186 118,181 118,190" fill="#f59e0b" />
                </g>
              )}

              {isNasal && (
                <g className="animate-pulse">
                  {/* Air going up through nasal cavity */}
                  <path
                    d="M 285 280 C 275 220 280 170 270 150 C 255 130 180 135 125 140"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="3"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                  />
                  <polygon points="115,140 126,134 126,146" fill="#059669" />
                </g>
              )}

              {/* 9. Vocal Cords (Dây thanh âm) & Vibration rings */}
              <g transform="translate(290, 325)">
                <ellipse cx="0" cy="0" rx="8" ry="4" fill="#e11d48" />
                {vocalCordVibration && (
                  <g className="animate-ping" style={{ transformOrigin: '290px 325px' }}>
                    <circle cx="0" cy="0" r="10" fill="none" stroke="#e11d48" strokeWidth="1.5" opacity="0.6" />
                    <circle cx="0" cy="0" r="16" fill="none" stroke="#e11d48" strokeWidth="1" opacity="0.3" />
                  </g>
                )}
              </g>

              {/* 10. TONGUE (Lưỡi) - dynamically rendered */}
              <path
                d={getTonguePath(preset)}
                fill="url(#tongueGrad)"
                stroke="#be123c"
                strokeWidth="1.8"
                className="transition-all duration-300 ease-out"
              />

              {/* 11. Point of Articulation Target Marker */}
              {contact && (
                <g className="transition-all duration-300">
                  <circle
                    cx={contact.x}
                    cy={contact.y}
                    r="8"
                    fill="#3b82f6"
                    fillOpacity="0.25"
                    className="animate-pulse"
                  />
                  <circle cx={contact.x} cy={contact.y} r="4" fill="#2563eb" />
                  <circle cx={contact.x} cy={contact.y} r="1.5" fill="#ffffff" />
                </g>
              )}

              {/* 12. Anatomical labels */}
              {showLabels && (
                <g className="text-[10px] font-sans fill-slate-600 transition-opacity duration-200">
                  {/* Ngạc cứng */}
                  <line x1="210" y1="140" x2="225" y2="105" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="230" y="105" fontWeight="600" fill="#334155">Ngạc cứng</text>

                  {/* Nướu răng (Alveolar) */}
                  <line x1="172" y1="155" x2="160" y2="120" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="120" y="115" fontWeight="600" fill="#334155">Lợi / Nướu trên</text>

                  {/* Ngạc mềm */}
                  <line x1="270" y1="180" x2="310" y2="155" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="315" y="155" fontWeight="600" fill="#334155">Ngạc mềm (Lưỡi gà)</text>

                  {/* Lưỡi */}
                  <line x1="210" y1="230" x2="200" y2="285" stroke="#e11d48" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="180" y="300" fontWeight="700" fill="#be123c">Thân lưỡi</text>

                  {/* Dây thanh */}
                  <line x1="290" y1="330" x2="340" y2="330" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="345" y="333" fontWeight="600" fill="#334155">
                    {vocalCordVibration ? 'Dây thanh (Rung)' : 'Dây thanh (Mở)'}
                  </text>

                  {/* Khoang mũi */}
                  <text x="175" y="70" fontWeight="600" fill="#64748b">Khoang mũi</text>
                </g>
              )}
            </svg>
          </div>
        ) : (
          /* Frontal View of Lip Position */
          <div className="w-full max-w-[340px] flex flex-col items-center justify-center py-4">
            <svg viewBox="0 0 240 180" className="w-48 h-36 drop-shadow-xs">
              <defs>
                <linearGradient id="lipFrontGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#be123c" />
                </linearGradient>
              </defs>

              {/* Face contour circle outline */}
              <ellipse cx="120" cy="90" rx="95" ry="75" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Teeth exposure background */}
              {isBilabialClosed ? null : (
                <rect
                  x={isRoundedMouth ? 104 : 85}
                  y="78"
                  width={isRoundedMouth ? 32 : 70}
                  height="24"
                  rx="4"
                  fill="#ffffff"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />
              )}

              {/* Upper Lip Frontal */}
              {isBilabialClosed ? (
                // Closed tight lips line
                <path
                  d="M 65 90 C 85 86, 110 84, 120 86 C 130 84, 155 86, 175 90 C 150 92, 90 92, 65 90 Z"
                  fill="url(#lipFrontGrad)"
                />
              ) : isRoundedMouth ? (
                // O or U shape rounded puckered lips
                <ellipse
                  cx="120"
                  cy="90"
                  rx={preset === 'vowel_yu' ? 18 : 26}
                  ry={preset === 'vowel_yu' ? 18 : 24}
                  fill="none"
                  stroke="url(#lipFrontGrad)"
                  strokeWidth={preset === 'vowel_yu' ? 16 : 14}
                />
              ) : (
                // Standard or spread lips (a, e, i, dental sibilants, retroflex)
                <g>
                  <path
                    d="M 60 90 C 80 80, 110 74, 120 78 C 130 74, 160 80, 180 90 C 155 85, 85 85, 60 90 Z"
                    fill="url(#lipFrontGrad)"
                  />
                  <path
                    d="M 60 90 C 80 102, 110 108, 120 108 C 130 108, 160 102, 180 90 C 155 96, 85 96, 60 90 Z"
                    fill="url(#lipFrontGrad)"
                  />
                </g>
              )}
            </svg>

            <div className="mt-2 text-center">
              <span className="text-xs font-semibold text-slate-800">
                Khẩu hình: {mouthShape}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isRoundedMouth
                  ? 'Môi chúm tròn nhô về phía trước'
                  : isBilabialClosed
                  ? 'Hai môi mím chặt chặn dòng khí'
                  : 'Mép môi hơi kéo sang 2 bên, để lộ hàm răng'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Articulation Mechanics & Indicators Footer */}
      <div className="p-3 sm:p-4 bg-slate-50/80 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {/* Vị trí lưỡi */}
          <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700 flex items-start gap-2">
            <div className="p-1 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Điểm đặt lưỡi
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200 leading-snug">
                {tonguePosition}
              </span>
            </div>
          </div>

          {/* Luồng hơi (Aspiration) */}
          <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700 flex items-start gap-2">
            <div
              className={`p-1 rounded ${
                aspiration === 'aspirated'
                  ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                  : aspiration === 'nasal'
                  ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                  : 'bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Luồng khí (Hơi)
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200 leading-snug">
                {aspiration === 'aspirated' && '▲ Bật hơi mạnh (Dùng khăn giấy kiểm tra)'}
                {aspiration === 'none' && '● Không bật hơi (Ngắt luồng hơi dứt khoát)'}
                {aspiration === 'friction' && '≈ Âm xát (Khí lách qua khe hẹp)'}
                {aspiration === 'nasal' && '✦ Âm mũi (Khí thoát ra khoang mũi)'}
                {aspiration === 'voiced' && '● Âm hữu thanh (Có luồng rung)'}
              </span>
            </div>
          </div>

          {/* Độ rung dây thanh */}
          <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700 flex items-start gap-2">
            <div
              className={`p-1 rounded ${
                vocalCordVibration ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Dây thanh âm
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200 leading-snug">
                {vocalCordVibration ? 'Có rung (Hữu thanh)' : 'Không rung (Vô thanh)'}
              </span>
            </div>
          </div>
        </div>

        {contact && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-300 bg-blue-50/70 dark:bg-blue-950/40 px-3 py-1.5 rounded-md border border-blue-100 dark:border-blue-900/60">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>
              <strong>Điểm tiếp xúc chuẩn:</strong> {contact.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
