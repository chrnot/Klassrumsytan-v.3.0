
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse, Modality, LiveServerMessage } from "@google/genai";
import { Message } from '../types';

interface GeminiAssistantProps {}

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encodeBase64(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  // FIX: Skapa en kopia av bufferten för att undvika SharedArrayBuffer-problem
  const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  const dataInt16 = new Int16Array(arrayBuffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hej! Jag är din digitala assistent. Klicka på "Prata Live" för att starta en röstkonversation eller skriv din fråga nedan.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<any>(null);
  const audioContexts = useRef<{ input?: AudioContext, output?: AudioContext }>({});
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading, isLiveActive]);

  const stopLive = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContexts.current.input) audioContexts.current.input.close();
    if (audioContexts.current.output) audioContexts.current.output.close();
    audioContexts.current = {};
    audioSourcesRef.current.forEach(s => s.stop());
    audioSourcesRef.current.clear();
    setIsLiveActive(false);
    setIsConnecting(false);
  }, []);

  const startLive = async () => {
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioCtx({ sampleRate: 16000 });
      const outputCtx = new AudioCtx({ sampleRate: 24000 });
      audioContexts.current = { input: inputCtx, output: outputCtx };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsLiveActive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: encodeBase64(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContexts.current.output) {
              const ctx = audioContexts.current.output;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const uint8 = decodeBase64(base64Audio);
              const buffer = await decodeAudioData(uint8, ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              audioSourcesRef.current.add(source);
              source.onended = () => audioSourcesRef.current.delete(source);
            }
            if (message.serverContent?.interrupted) {
              audioSourcesRef.current.forEach(s => s.stop());
              audioSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => stopLive(),
          onerror: () => stopLive()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
          systemInstruction: 'Du är en hjälpsam lärarassistent. Svara kort och vänligt på svenska.'
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
      alert("Kunde inte starta röstsamtal.");
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: "Du är en expertpedagog. Föreslå snabba aktiviteter. Svara kort på svenska.",
          temperature: 0.7,
        },
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response.text || "Ett fel uppstod." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Ett fel uppstod." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden pt-6">
      <div className="px-6 mb-4 flex justify-end shrink-0">
        <button onClick={isLiveActive ? stopLive : startLive} disabled={isConnecting} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg border ${isLiveActive ? 'bg-red-500 border-red-600 text-white animate-pulse' : 'bg-white text-indigo-600 border-indigo-100 hover:bg-indigo-50'}`}>
          {isConnecting ? 'Ansluter...' : isLiveActive ? '🔴 Avsluta Live' : '🎙️ Prata Live'}
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/30">
        {messages.map((msg, i) => (
          <div key={i} className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm font-medium leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white ml-auto shadow-md' : 'bg-white border border-slate-100 text-slate-700 shadow-sm'}`}>
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className="bg-white border border-slate-100 p-4 rounded-[1.5rem] w-fit shadow-sm">
            <span className="flex gap-1"><span className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span></span>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-100 flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} disabled={isLiveActive} placeholder="Fråga assistenten..." className="flex-1 px-5 py-4 rounded-2xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 shadow-inner" />
        <button type="submit" disabled={isLoading || !input.trim() || isLiveActive} className="px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg active:scale-95 disabled:opacity-50">Sänd</button>
      </form>
    </div>
  );
};

export default GeminiAssistant;
