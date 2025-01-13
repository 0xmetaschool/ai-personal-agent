import { NextRequest } from 'next/server';
import { assistant } from '../ai-assistant';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data?.text) {
      return new Response(JSON.stringify({ error: 'No text provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('Received text:', data.text);
    
    const response = await assistant.getResponse(data.text);
    console.log('AI Response:', response);
    
    return new Response(JSON.stringify({ response }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in /api/text:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}