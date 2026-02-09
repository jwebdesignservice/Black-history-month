import { NextRequest, NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = 'sk_abd760726b4fe39df06a4e23b03d3f46abbc6c828e10f374';
const DEFAULT_VOICE_ID = 'SAxJUlDKRc79XAyeWyMu'; // Morgan Freeman voice

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Use provided voiceId or default to Morgan Freeman
    const selectedVoiceId = voiceId || DEFAULT_VOICE_ID;
    console.log('ElevenLabs TTS request for text:', text, 'with voice:', selectedVoiceId);

    // ElevenLabs Text-to-Speech API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs error:', errorText);
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    // Convert audio buffer to base64
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    console.log('ElevenLabs TTS success! Audio generated.');

    return NextResponse.json({ 
      status: 'success',
      output: [audioUrl],
      audio_url: audioUrl 
    });
  } catch (error: unknown) {
    console.error('Voice API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
