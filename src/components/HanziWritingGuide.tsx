import React, { useState, useRef, useEffect } from 'react';
import {
  BASIC_STROKES,
  STROKE_ORDER_RULES,
  HANZI_PRACTICE_CHARACTERS,
  BasicStroke,
  StrokeOrderRule,
  HanziCharacterItem,
} from '../data/hanziData';
import { audioService } from '../utils/audio';
import {
  PenTool,
  BookOpen,
  ListOrdered,
  RotateCcw,
  Eraser,
  Eye,
  EyeOff,
  Play,
  Volume2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Palette,
  Sparkles,
  Grid,
} from 'lucide-react';

type WritingSectionTab = 'canvas' | 'basic_strokes' | 'rules';
type GridType = 'tianzige' | 'mizige' | 'blank';

export const HanziWritingGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<WritingSectionTab>('canvas');

  // Interactive Practice State
  const [selectedChar, setSelectedChar] = useState<HanziCharacterItem>(HANZI_PRACTICE_CHARACTERS[0]);
  const [gridType, setGridType] = useState<GridType>('mizige');
  const [showGhost, setShowGhost] = useState(true);
  const [brushColor, setBrushColor] = useState('#1e293b'); // Dark slate / traditional ink
  const [brushWidth, setBrushWidth] = useState(6);
  const [isAnimatingStrokes, setIsAnimatingStrokes] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  // Basic strokes selected
  const [selectedBasicStroke, setSelectedBasicStroke] = useState<BasicStroke>(BASIC_STROKES[0]);

  // Stroke rule selected
  const [selectedRule, setSelectedRule] = useState<StrokeOrderRule>(STROKE_ORDER_RULES[0]);
  const [ruleActiveStep, setRuleActiveStep] = useState(0);

  // Canvas drawing ref and history for undo
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const strokeHistoryRef = useRef<ImageData[]>([]);

  // Sound playing state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (activeSection === 'canvas') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Handle retina displays
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Save initial clean state
      strokeHistoryRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
    }
  }, [activeSection, selectedChar]);

  const handlePlayCharAudio = async (charText: string) => {
    setIsPlayingAudio(true);
    await audioService.speakChinese(charText);
    setIsPlayingAudio(false);
  };

  // Canvas Drawing Handlers (Touch & Mouse)
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save current canvas state before stroke
    strokeHistoryRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (strokeHistoryRef.current.length > 20) {
      strokeHistoryRef.current.shift();
    }

    isDrawingRef.current = true;
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushWidth;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokeHistoryRef.current = [];
  };

  const handleUndoCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (strokeHistoryRef.current.length > 0) {
      const lastState = strokeHistoryRef.current.pop()!;
      ctx.putImageData(lastState, 0, 0);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Stroke Order Animation Controller
  const handlePlayStrokeAnimation = () => {
    if (isAnimatingStrokes) return;
    setIsAnimatingStrokes(true);
    setAnimationStep(0);

    const totalStrokes = selectedChar.strokes.length;
    let step = 0;

    const interval = setInterval(() => {
      step += 1;
      if (step <= totalStrokes) {
        setAnimationStep(step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsAnimatingStrokes(false);
          setAnimationStep(0);
        }, 1200);
      }
    }, 750);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg overflow-x-auto">
          <button
            onClick={() => setActiveSection('canvas')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-2 ${
              activeSection === 'canvas'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Phòng Luyện Viết Tương Tác</span>
          </button>
          <button
            onClick={() => setActiveSection('basic_strokes')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-2 ${
              activeSection === 'basic_strokes'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>8 Nét Cơ Bản (Bát Pháp)</span>
          </button>
          <button
            onClick={() => setActiveSection('rules')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-2 ${
              activeSection === 'rules'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>7 Quy Tắc Bút Thuận</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Hoạt động <strong>100% Ngoại tuyến</strong> (Không cần mạng)</span>
        </div>
      </div>

      {/* SECTION 1: INTERACTIVE HANDWRITING CANVAS STUDIO */}
      {activeSection === 'canvas' && (
        <div className="space-y-6">
          {/* Character Quick Picker Strip */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Chọn chữ Hán để học viết & phân tích từng nét bút thuận:
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {HANZI_PRACTICE_CHARACTERS.length} chữ cơ bản chuẩn HSK 1
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {HANZI_PRACTICE_CHARACTERS.map((item) => {
                const isSelected = selectedChar.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedChar(item);
                      handleClearCanvas();
                      setIsAnimatingStrokes(false);
                      setAnimationStep(0);
                    }}
                    className={`min-w-14 sm:min-w-16 h-14 sm:h-16 rounded-xl flex flex-col items-center justify-center transition-all shrink-0 border ${
                      isSelected
                        ? 'bg-rose-600 dark:bg-rose-600 text-white shadow-sm ring-2 ring-rose-500 ring-offset-2 dark:ring-offset-slate-900 border-rose-600'
                        : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl font-hanzi font-bold leading-none">
                      {item.char}
                    </span>
                    <span
                      className={`text-[10px] font-mono mt-1 ${
                        isSelected ? 'text-rose-100' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {item.pinyin}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Writing Studio Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 6 Cols: Canvas & Controls */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
                {/* Canvas Top Bar: Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  {/* Grid Selector */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                      onClick={() => setGridType('mizige')}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                        gridType === 'mizige'
                          ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                      title="Lưới Mễ (米字格 - 8 ô tam giác chuẩn thư pháp)"
                    >
                      Mễ tự cách (米)
                    </button>
                    <button
                      onClick={() => setGridType('tianzige')}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                        gridType === 'tianzige'
                          ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                      title="Lưới Điền (田字格 - 4 ô vuông)"
                    >
                      Điền tự cách (田)
                    </button>
                    <button
                      onClick={() => setGridType('blank')}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                        gridType === 'blank'
                          ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                      title="Ô trơn không lưới"
                    >
                      Trơn
                    </button>
                  </div>

                  {/* Ghost Trace Toggle & Colors */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowGhost(!showGhost)}
                      className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        showGhost
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                      title="Bật/Tắt nét chữ mẫu mờ để tô theo"
                    >
                      {showGhost ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>Mẫu mờ</span>
                    </button>

                    {/* Ink colors */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                      <button
                        onClick={() => setBrushColor('#1e293b')}
                        className={`w-5 h-5 rounded-full bg-slate-900 ring-2 ${
                          brushColor === '#1e293b' ? 'ring-rose-500 scale-110' : 'ring-transparent'
                        }`}
                        title="Mực đen truyền thống"
                      />
                      <button
                        onClick={() => setBrushColor('#e11d48')}
                        className={`w-5 h-5 rounded-full bg-rose-600 ring-2 ${
                          brushColor === '#e11d48' ? 'ring-rose-400 scale-110' : 'ring-transparent'
                        }`}
                        title="Son đỏ thư pháp"
                      />
                      <button
                        onClick={() => setBrushColor('#2563eb')}
                        className={`w-5 h-5 rounded-full bg-blue-600 ring-2 ${
                          brushColor === '#2563eb' ? 'ring-blue-400 scale-110' : 'ring-transparent'
                        }`}
                        title="Mực xanh bút máy"
                      />
                    </div>
                  </div>
                </div>

                {/* The Interactive Writing Board Canvas */}
                <div className="relative my-4 aspect-square max-w-[380px] mx-auto rounded-xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 bg-amber-50/30 dark:bg-slate-950 select-none touch-none shadow-inner">
                  {/* Grid Background Overlay (Tianzige / Mizige SVG) */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none stroke-rose-300/40 dark:stroke-rose-900/30"
                    viewBox="0 0 200 200"
                    fill="none"
                  >
                    {/* Outer border */}
                    <rect x="0" y="0" width="200" height="200" strokeWidth="2" strokeDasharray="none" />

                    {gridType !== 'blank' && (
                      <>
                        {/* Horizontal & Vertical center lines */}
                        <line x1="0" y1="100" x2="200" y2="100" strokeWidth="1.5" strokeDasharray="4 4" />
                        <line x1="100" y1="0" x2="100" y2="200" strokeWidth="1.5" strokeDasharray="4 4" />
                      </>
                    )}

                    {gridType === 'mizige' && (
                      <>
                        {/* Diagonal lines */}
                        <line x1="0" y1="0" x2="200" y2="200" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="200" y1="0" x2="0" y2="200" strokeWidth="1" strokeDasharray="3 3" />
                      </>
                    )}
                  </svg>

                  {/* Ghost Reference Character Template (Traced SVG) */}
                  {showGhost && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-[170px] sm:text-[190px] font-hanzi font-normal leading-none text-slate-300/45 dark:text-slate-700/50 select-none">
                        {selectedChar.char}
                      </span>
                    </div>
                  )}

                  {/* Animated Stroke Order Playback Overlay */}
                  {isAnimatingStrokes && (
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      viewBox="0 0 200 200"
                    >
                      {selectedChar.strokes.map((stroke, sIdx) => {
                        const isVisible = sIdx < animationStep;
                        if (!isVisible) return null;
                        const isCurrentAnimated = sIdx === animationStep - 1;
                        return (
                          <path
                            key={sIdx}
                            d={stroke.path}
                            fill="none"
                            stroke={isCurrentAnimated ? '#e11d48' : '#334155'}
                            strokeWidth="11"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={isCurrentAnimated ? 'animate-pulse' : ''}
                          />
                        );
                      })}
                    </svg>
                  )}

                  {/* Active Handwriting HTML5 Canvas Layer */}
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                  />

                  {/* Bottom Indicator */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pointer-events-none px-1">
                    <span>Vẽ bằng chuột hoặc chạm ngón tay</span>
                    <span className="font-mono">
                      {isAnimatingStrokes
                        ? `Đang chạy nét: ${animationStep}/${selectedChar.strokes.length}`
                        : `${selectedChar.strokeCount} nét`}
                    </span>
                  </div>
                </div>

                {/* Canvas Bottom Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePlayStrokeAnimation}
                      disabled={isAnimatingStrokes}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isAnimatingStrokes ? 'Đang mô phỏng nét...' : 'Xem hoạt ảnh bút thuận'}</span>
                    </button>

                    <button
                      onClick={() => handlePlayCharAudio(selectedChar.char)}
                      disabled={isPlayingAudio}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Nghe phát âm chuẩn của chữ này"
                    >
                      <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-rose-600' : ''}`} />
                      <span className="hidden sm:inline">Phát âm</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleUndoCanvas}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Hoàn tác nét vẽ vừa viết (Undo)"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span className="hidden sm:inline">Lùi lại</span>
                    </button>
                    <button
                      onClick={handleClearCanvas}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Xóa toàn bộ để viết lại"
                    >
                      <Eraser className="w-4 h-4" />
                      <span className="hidden sm:inline">Xóa bảng</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 6 Cols: Stroke-by-Stroke Order Breakdown & Character Insight */}
            <div className="lg:col-span-6 space-y-4">
              {/* Character Details Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-16 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex items-center justify-center font-hanzi font-bold text-3xl sm:text-4xl text-rose-600 dark:text-rose-400">
                      {selectedChar.char}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-mono font-extrabold text-slate-900 dark:text-slate-100">
                          {selectedChar.pinyin}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-400">
                          {selectedChar.level}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                        Hán Việt: <strong className="text-rose-600 dark:text-rose-400">{selectedChar.hanViet}</strong> · Nghĩa: {selectedChar.meaning}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Bộ thủ: <strong>{selectedChar.radical}</strong> · Tổng số nét: <strong>{selectedChar.strokeCount} nét</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePlayCharAudio(selectedChar.char)}
                    className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 text-xs font-semibold shrink-0"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Nghe đọc</span>
                  </button>
                </div>

                {/* Mnemonic story box */}
                <div className="mt-4 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-950 dark:text-amber-200 font-bold block mb-0.5">
                        Ý nghĩa tượng hình & Mẹo ghi nhớ nét:
                      </strong>
                      <p className="text-amber-900 dark:text-amber-300 leading-relaxed">
                        {selectedChar.mnemonicStory}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Stroke Order List */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ListOrdered className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    Thứ tự từng nét bút thuận ({selectedChar.strokes.length} nét):
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Viết đúng thứ tự nét để chữ vuông cân đối
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedChar.strokes.map((stroke, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-rose-200 dark:hover:border-rose-900 flex items-center justify-between gap-3 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-mono font-bold flex items-center justify-center shrink-0">
                          {stroke.index}
                        </span>
                        <div>
                          <strong className="text-slate-900 dark:text-slate-100 font-semibold block text-sm">
                            {stroke.name}
                          </strong>
                          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                            {stroke.directionDescription}
                          </p>
                        </div>
                      </div>

                      {/* Mini Stroke Vector Visualizer */}
                      <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                        <svg className="w-9 h-9" viewBox="0 0 200 200">
                          <path
                            d={stroke.path}
                            fill="none"
                            stroke="#e11d48"
                            strokeWidth="16"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: 8 BASIC STROKES (VĨNH TỰ BÁT PHÁP) */}
      {activeSection === 'basic_strokes' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-rose-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              Vĩnh Tự Bát Pháp (永字八法) - 8 Nét Cơ Bản Của Chữ Hán
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Mọi chữ Hán trong hàng vạn con chữ đều được cấu thành từ 8 nét căn bản này. Trong thư pháp truyền thống, chữ <strong>Vĩnh (永)</strong> chứa trọn vẹn cả 8 nét, chỉ cần luyện thuần thục 8 nét này là bạn có thể viết đẹp bất kỳ chữ Hán nào!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 4 Cols: 8 Strokes Selector List */}
            <div className="lg:col-span-4 space-y-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Chọn nét cơ bản để học kỹ thuật:
              </span>

              {BASIC_STROKES.map((stroke, idx) => {
                const isSelected = selectedBasicStroke.id === stroke.id;
                return (
                  <button
                    key={stroke.id}
                    onClick={() => setSelectedBasicStroke(stroke)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-hanzi font-bold text-xl text-rose-600 dark:text-rose-400">
                        {stroke.nameZh}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {stroke.nameVi}
                          </strong>
                          <span className="text-xs font-mono text-slate-400">
                            ({stroke.pinyin})
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                          Hướng: {stroke.direction}
                        </span>
                      </div>
                    </div>

                    <span className="text-base font-bold text-rose-600 dark:text-rose-400">
                      {stroke.directionIcon}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right 8 Cols: Detailed Stroke Tuition & Demonstration */}
            <div className="lg:col-span-8 space-y-5">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl sm:text-4xl font-hanzi font-extrabold text-rose-600 dark:text-rose-400">
                        {selectedBasicStroke.nameZh}
                      </span>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                          {selectedBasicStroke.nameVi} ({selectedBasicStroke.pinyin})
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Hướng đưa bút: <strong>{selectedBasicStroke.direction}</strong> ({selectedBasicStroke.directionIcon})
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SVG Stroke Visual Demonstration */}
                  <div className="w-24 h-24 rounded-2xl bg-amber-50/50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center p-2 shadow-inner self-start sm:self-auto shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Grid helper */}
                      <line x1="0" y1="50" x2="100" y2="50" stroke="#cbd5e1" strokeDasharray="2 2" strokeWidth="0.8" />
                      <line x1="50" y1="0" x2="50" y2="100" stroke="#cbd5e1" strokeDasharray="2 2" strokeWidth="0.8" />
                      {/* Stroke path */}
                      <path
                        d={selectedBasicStroke.svgPath}
                        fill="none"
                        stroke="#e11d48"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedBasicStroke.description}
                </p>

                {/* 3 Step Writing Technique */}
                <div className="mt-5 space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    Kỹ thuật đặt bút & hành bút chuẩn:
                  </h4>
                  <div className="space-y-2">
                    {selectedBasicStroke.writingTechnique.map((step, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold flex items-center justify-center shrink-0">
                          {sIdx + 1}
                        </span>
                        <p className="leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Mistakes */}
                <div className="mt-5 p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-950 dark:text-amber-200 font-bold block mb-1">
                        Lỗi sai người mới học hay mắc:
                      </strong>
                      <p className="text-amber-900 dark:text-amber-300 leading-relaxed">
                        {selectedBasicStroke.commonMistakes}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sample Hanzi using this stroke */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2.5">
                    Các chữ Hán tiêu biểu chứa nét này (Bấm nghe âm):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedBasicStroke.sampleHanzi.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-2"
                      >
                        <div>
                          <span className="text-2xl font-hanzi font-bold text-slate-900 dark:text-slate-100">
                            {item.char}
                          </span>
                          <div className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                            {item.pinyin}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {item.meaning}
                          </div>
                        </div>

                        <button
                          onClick={() => handlePlayCharAudio(item.char)}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-rose-600 text-slate-600 dark:text-slate-300 transition-colors"
                          title="Nghe phát âm"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: 7 CORE STROKE ORDER RULES (QUY TẮC BÚT THUẬN) */}
      {activeSection === 'rules' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-rose-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              7 Quy Tắc Bút Thuận Bất Di Bất Dịch (笔顺规则)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Viết đúng thứ tự nét (Bút thuận) là bí quyết giúp bạn viết chữ Hán nhanh, đẹp, nét bút liền mạch và ghi nhớ mặt chữ lâu gấp 3 lần so với viết tùy hứng.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 4 Cols: 7 Rules Selector */}
            <div className="lg:col-span-4 space-y-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                7 quy tắc cốt lõi:
              </span>

              {STROKE_ORDER_RULES.map((rule) => {
                const isSelected = selectedRule.id === rule.id;
                return (
                  <button
                    key={rule.id}
                    onClick={() => {
                      setSelectedRule(rule);
                      setRuleActiveStep(0);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-rose-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {rule.number}
                      </span>
                      <div>
                        <strong className="text-sm font-bold text-slate-900 dark:text-slate-100 block">
                          {rule.ruleVi}
                        </strong>
                        <span className="text-xs font-hanzi text-slate-500 dark:text-slate-400">
                          {rule.ruleZh} · {rule.formula}
                        </span>
                      </div>
                    </div>

                    <div className="text-lg font-hanzi font-bold text-rose-600 dark:text-rose-400 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">
                      {rule.exampleChar}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right 8 Cols: Interactive Rule Breakdown & Animation */}
            <div className="lg:col-span-8 space-y-5">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
                {/* Rule Title Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                      Quy tắc {selectedRule.number}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      {selectedRule.ruleVi} ({selectedRule.ruleZh})
                    </h3>
                    <p className="text-xs font-mono text-slate-400">
                      {selectedRule.pinyin} · Công thức: <strong>{selectedRule.formula}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Chữ mẫu minh họa:</span>
                      <span className="text-2xl font-hanzi font-bold text-rose-600 dark:text-rose-400">
                        {selectedRule.exampleChar}
                      </span>
                      <span className="text-xs text-slate-500 block">({selectedRule.exampleMeaning})</span>
                    </div>
                    <button
                      onClick={() => handlePlayCharAudio(selectedRule.exampleChar)}
                      className="p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors"
                      title="Nghe đọc chữ mẫu"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Explanation */}
                <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-slate-100 block mb-1">
                    Bản chất quy tắc:
                  </strong>
                  {selectedRule.explanation}
                </div>

                {/* Interactive Step-by-Step Sequence */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ListOrdered className="w-4 h-4 text-rose-600" />
                      Trình tự từng bước viết chữ "{selectedRule.exampleChar}":
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedRule.steps.length} bước
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedRule.steps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-2xs hover:border-rose-300 dark:hover:border-rose-900 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                            Bước {step.stepNumber}
                          </span>
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                            {step.strokeName}
                          </span>
                        </div>

                        {/* Step Snapshot Box */}
                        <div className="my-2 aspect-square max-w-[130px] mx-auto w-full rounded-xl bg-amber-50/40 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 flex items-center justify-center">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            {/* Grid */}
                            <line x1="0" y1="50" x2="100" y2="50" stroke="#e2e8f0" strokeDasharray="2 2" strokeWidth="0.8" />
                            <line x1="50" y1="0" x2="50" y2="100" stroke="#e2e8f0" strokeDasharray="2 2" strokeWidth="0.8" />
                            {/* Path */}
                            <path
                              d={step.snapshotPath}
                              fill="none"
                              stroke="#e11d48"
                              strokeWidth="6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>

                        <p className="text-[11px] text-slate-600 dark:text-slate-400 text-center leading-normal mt-1">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
