import { NextRequest } from 'next/server';
import { ElevenLabsClient } from 'elevenlabs';
import OpenAI from 'openai';
import { Readable } from 'stream';
import { assistant } from '../ai-assistant';

// Initialize OpenAI for transcription
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize ElevenLabs Client
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
});

// Helper function to convert Readable to Buffer
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

// Function to transcribe audio
async function transcribeAudio(buffer: Buffer): Promise<string> {
  try {
    const file = new File([buffer], 'audio.wav', { type: 'audio/wav' });
    
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
    });
    
    return transcription.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error(`Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify API keys are present
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }
    if (!process.env.ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key is not configured');
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return new Response('No audio file received', { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Received audio file:', {
      type: audioFile.type,
      size: audioFile.size,
      name: audioFile.name
    });

    // Convert File to Buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Transcribe audio to text
    console.log('Starting transcription...');
    const question = await transcribeAudio(buffer);
    console.log('Transcribed text:', question);
    
    // Get AI response using the existing assistant
    console.log('Getting AI response...');
    const response = await assistant.getResponse(question);
    console.log('AI Response:', response);

    // Generate audio response using ElevenLabs
    console.log('Generating audio response...');
    const audioStream = await elevenlabs.generate({
      voice: "Rachel",
      text: response || "I'm sorry, I couldn't generate a response.",
      model_id: "eleven_multilingual_v2",
    });

    // Convert the stream to a buffer
    const audioBuffer = await streamToBuffer(audioStream as Readable);
    
    console.log('Audio response generated successfully');

    // Return the audio response
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString()
      }
    });
  } catch (error) {
    console.error('Detailed error in /api/speak:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Failed to process audio',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}