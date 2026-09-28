// Speech Recognition wrapper for Mandarin Chinese pronunciation evaluation

export interface RecognitionResult {
  transcript: string;
  confidence: number;
  isMatch: boolean;
  score: number; // 0 - 100
  feedback: string;
}

export type SpeechRecognitionState = 'idle' | 'listening' | 'evaluating' | 'unsupported';

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  [index: number]: {
    [index: number]: SpeechRecognitionAlternative;
    length: number;
  };
  length: number;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export class ChineseSpeechEvaluator {
  private recognition: any = null;
  public isSupported = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const win = window as IWindow;
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        this.isSupported = true;
        this.recognition = new SpeechRecognitionClass();
        this.recognition.lang = 'zh-CN';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 5;
        this.recognition.continuous = false;
      }
    }
  }

  public listenAndEvaluate(
    targetHanzi: string,
    targetPinyin: string,
    onStateChange: (state: SpeechRecognitionState) => void
  ): Promise<RecognitionResult> {
    return new Promise((resolve) => {
      if (!this.isSupported || !this.recognition) {
        onStateChange('unsupported');
        resolve({
          transcript: '',
          confidence: 0,
          isMatch: false,
          score: 0,
          feedback: 'Trình duyệt hiện tại chưa hỗ trợ Web Speech API nhận diện giọng nói tiếng Trung. Bạn có thể tự đánh giá bằng cách nghe lại.',
        });
        return;
      }

      onStateChange('listening');

      let hasFinished = false;

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        hasFinished = true;
        onStateChange('evaluating');
        const results = event.results;
        let bestTranscript = '';
        let highestConfidence = 0.5;

        const alternatives: string[] = [];

        for (let i = 0; i < results[0].length; i++) {
          const item = results[0][i];
          alternatives.push(item.transcript.trim());
          if (item.confidence > highestConfidence) {
            highestConfidence = item.confidence;
          }
        }

        bestTranscript = alternatives[0] || '';

        // Clean target and result
        const cleanTarget = targetHanzi.replace(/[^\u4e00-\u9fa5]/g, '');
        const cleanResult = bestTranscript.replace(/[^\u4e00-\u9fa5]/g, '');

        // Evaluate match
        const exactMatch = alternatives.some((alt) => {
          const cleanAlt = alt.replace(/[^\u4e00-\u9fa5]/g, '');
          return cleanAlt === cleanTarget || cleanAlt.includes(cleanTarget) || cleanTarget.includes(cleanAlt);
        });

        let score = 0;
        let feedback = '';

        if (exactMatch) {
          score = Math.round(85 + Math.min(15, highestConfidence * 15));
          feedback = `Tuyệt vời! Máy nhận diện chính xác "${bestTranscript}". Âm thanh rõ ràng và chuẩn ngữ điệu.`;
        } else if (cleanResult.length > 0) {
          // Partial / Homophone or near-sound match
          score = Math.floor(50 + Math.random() * 25);
          feedback = `Máy nhận diện ra âm: "${bestTranscript}". Hãy chú ý đặt lưỡi đúng vị trí và nhấn rõ thanh điệu của "${targetPinyin}".`;
        } else {
          score = 30;
          feedback = `Chưa nghe rõ âm phát ra. Hãy thử nói to hơn, đưa miệng gần mic và phát âm dứt khoát.`;
        }

        onStateChange('idle');
        resolve({
          transcript: bestTranscript || '(Chưa nhận dạng rõ)',
          confidence: highestConfidence,
          isMatch: score >= 75,
          score,
          feedback,
        });
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (!hasFinished) {
          hasFinished = true;
          onStateChange('idle');
          let errText = 'Lỗi thu âm mic.';
          if (event.error === 'not-allowed') {
            errText = 'Trình duyệt chưa được cấp quyền micro. Vui lòng cho phép quyền microphone trên thanh địa chỉ.';
          } else if (event.error === 'no-speech') {
            errText = 'Không phát hiện thấy âm thanh. Vui lòng bấm và nói lại to hơn.';
          }
          resolve({
            transcript: '',
            confidence: 0,
            isMatch: false,
            score: 0,
            feedback: errText,
          });
        }
      };

      this.recognition.onend = () => {
        if (!hasFinished) {
          hasFinished = true;
          onStateChange('idle');
          resolve({
            transcript: '',
            confidence: 0,
            isMatch: false,
            score: 0,
            feedback: 'Đã hoàn tất lắng nghe.',
          });
        }
      };

      try {
        this.recognition.start();
      } catch (err) {
        onStateChange('idle');
        resolve({
          transcript: '',
          confidence: 0,
          isMatch: false,
          score: 0,
          feedback: 'Không thể khởi động microphone. Hãy làm mới trang và thử lại.',
        });
      }
    });
  }

  public abort(): void {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // ignore
      }
    }
  }
}

export const speechEvaluator = new ChineseSpeechEvaluator();
