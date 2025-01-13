import OpenAI from 'openai';
import { PersonalAssistant } from './personal-assistant';

// Initialize OpenAI and Personal Assistant once
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const assistant = new PersonalAssistant({
  openaiKey: process.env.OPENAI_API_KEY!,
  weatherApiKey: process.env.WEATHER_API_KEY!,
  serpApiKey: process.env.SERP_API_KEY!
});

// Helper function to transcribe audio using OpenAI's Whisper
export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    // Create a File object from the buffer
    const file = new File(
      [audioBuffer],
      'audio.wav',
      { type: 'audio/wav', lastModified: Date.now() }
    );

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
    });
    return transcription.text;
  } catch (error) {
    console.error('Error in transcribeAudio:', error);
    throw new Error('Failed to transcribe audio');
  }
}