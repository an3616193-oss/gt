import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  app.use(express.json());

  // In-memory cache for audio snippets to ensure instantaneous response
  const ttsCache = new Map<string, { audioBase64: string; mimeType: string }>();

  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Prepend standard 44-byte RIFF WAV header to 16-bit PCM buffer (sampleRate: 24000)
  function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1): Buffer {
    const byteRate = sampleRate * numChannels * 2;
    const blockAlign = numChannels * 2;
    const header = Buffer.alloc(44);

    header.write('RIFF', 0);
    header.writeUInt32LE(36 + pcmBuffer.length, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16); // SubChunk1Size (16 for PCM)
    header.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
    header.writeUInt16LE(numChannels, 22); // NumChannels
    header.writeUInt32LE(sampleRate, 24); // SampleRate
    header.writeUInt32LE(byteRate, 28); // ByteRate
    header.writeUInt16LE(blockAlign, 32); // BlockAlign
    header.writeUInt16LE(16, 34); // BitsPerSample
    header.write('data', 36);
    header.writeUInt32LE(pcmBuffer.length, 40); // SubChunk2Size

    return Buffer.concat([header, pcmBuffer]);
  }

  // Track API quota cooldown to avoid repetitive 429 errors and log spamming
  let quotaCooldownUntil = 0;

  // TTS Endpoint: Standard Mandarin pronunciation with voice customization
  app.post('/api/tts', async (req, res) => {
    try {
      const { text, pedagogicalText, tone, voiceName: reqVoice } = req.body;
      const targetText = (pedagogicalText || text || '').trim();

      if (!targetText) {
        return res.status(400).json({ error: 'Text or syllable is required' });
      }

      // Valid prebuilt voices: 'Kore', 'Zephyr', 'Puck', 'Fenrir', 'Charon'
      const validVoices = ['Kore', 'Zephyr', 'Puck', 'Fenrir', 'Charon'];
      const voiceName = (reqVoice && validVoices.includes(reqVoice)) ? reqVoice : 'Kore';

      const cacheKey = `${targetText}_${voiceName}_${tone || 'default'}`;
      if (ttsCache.has(cacheKey)) {
        return res.json(ttsCache.get(cacheKey));
      }

      if (!ai) {
        return res.json({ fallback: true, reason: 'no_api_key' });
      }

      // If we are currently in quota cooldown, immediately fallback without making a failing network request
      if (Date.now() < quotaCooldownUntil) {
        return res.json({ fallback: true, reason: 'quota_cooldown' });
      }

      // Target text MUST be strictly the Chinese character or syllable itself
      // Absolutely no instructional words or conversational preamble, so the audio plays only the exact sound
      let rawData: string | undefined;
      let rawMime: string = 'audio/pcm;rate=24000';

      const generateSpeech = async (model: string) => {
        const response = await ai!.models.generateContent({
          model,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: targetText,
                  speechMetadata: {
                    style: 'Native Mandarin Chinese, crisp, accurate standard Beijing pronunciation with exact tone, zero preamble',
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName },
              },
            },
          },
        });
        const part = response.candidates?.[0]?.content?.parts?.[0];
        return {
          data: part?.inlineData?.data,
          mime: part?.inlineData?.mimeType || 'audio/pcm;rate=24000',
        };
      };

      try {
        const genResult = await generateSpeech('gemini-3.8-flash-lite-tts');
        rawData = genResult.data;
        rawMime = genResult.mime;
      } catch (err: any) {
        const isQuota = err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('RESOURCE_EXHAUSTED') || err?.message?.includes('quota');
        if (isQuota) {
          quotaCooldownUntil = Date.now() + 60000; // 60s cooldown
          // Try fallback model once if different quota pool
          try {
            const fallbackResult = await generateSpeech('gemini-3.8-flash-tts');
            rawData = fallbackResult.data;
            rawMime = fallbackResult.mime;
            quotaCooldownUntil = 0; // fallback succeeded
          } catch {
            return res.json({ fallback: true, reason: 'quota_exceeded' });
          }
        } else {
          return res.json({ fallback: true, reason: 'tts_error' });
        }
      }

      if (!rawData) {
        return res.json({ fallback: true, reason: 'no_audio_data' });
      }

      let audioBase64 = rawData;
      let mimeType = rawMime;

      // If raw PCM, encapsulate into standard playable WAV
      if (rawMime.includes('pcm')) {
        const pcmBuf = Buffer.from(rawData, 'base64');
        const wavBuf = pcmToWav(pcmBuf, 24000, 1);
        audioBase64 = wavBuf.toString('base64');
        mimeType = 'audio/wav';
      }

      const result = { audioBase64, mimeType };
      ttsCache.set(cacheKey, result);
      return res.json(result);
    } catch {
      return res.json({ fallback: true, reason: 'internal_error' });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      cacheSize: ttsCache.size,
    });
  });

  // Mount Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, port: 3000, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
