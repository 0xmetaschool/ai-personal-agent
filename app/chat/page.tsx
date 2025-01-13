"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, User, Mic, Send, StopCircle } from "lucide-react";

interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface TypingEffectProps {
  text: string;
  speed?: number;
}

const TypingEffect = ({ text, speed = 30 }: TypingEffectProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed]);

  return (
    <div className="whitespace-pre-wrap">
      {displayedText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </div>
  );
};

const ChatInterface = () => {
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [textInput, setTextInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Add predefined messages
  const predefinedMessages = [
    "Tell me about today's weather in singapore city",
    "Who won US election in 2024?",
    "Current weather in New york",
    "Current prime minister of Canada"
  ];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (audioUrl && isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  }, [audioUrl, isPlaying]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handlePredefinedMessage = (message: string) => {
    setTextInput(message);
    if (textareaRef.current) {
      textareaRef.current.focus();
      adjustTextareaHeight();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      const mediaRecorder = new MediaRecorder(stream);
      setRecorder(mediaRecorder);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        sendAudioToBackend(audioBlob);
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Failed to access microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (recorder && recorder.state === "recording") {
      recorder.stop();
      recorder.stream.getTracks().forEach((track) => track.stop());
      setRecorder(null);
      setAudioStream(null);
    }
  };

  const sendTextMessage = async () => {
    if (!textInput.trim() || isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { 
      type: 'user', 
      content: textInput,
      timestamp: new Date()
    }]);

    try {
      const response = await fetch('/api/text', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: data.response,
        timestamp: new Date()
      }]);
      setTextInput("");
    } catch (error) {
      console.error("Error sending text message:", error);
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendAudioToBackend = async (audioBlob: Blob) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");

    try {
      const response = await fetch('/api/speak', {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.details || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const audioResponseBlob = await response.blob();
      const url = URL.createObjectURL(audioResponseBlob);
      setAudioUrl(url);
      setIsPlaying(true);

      setMessages(prev => [...prev, {
        type: 'user',
        content: 'Voice agent is responding...',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("Error sending audio to backend:", error);
      
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      }]);
      
      alert("Failed to process audio. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setAudioUrl("");
    URL.revokeObjectURL(audioUrl);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 flex flex-col px-4 py-4 border-b bg-white">
        <div className="flex items-center space-x-2 mb-2 mt-2">
          <Bot className="w-8 h-8 text-blue-500" />
          <h1 className="text-xl font-bold">AI Personal Agent</h1>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4 space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start max-w-[80%] space-x-2
                ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${message.type === 'user' ? 'bg-blue-500' : 'bg-gray-200'}`}
                >
                  {message.type === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div className={`rounded-lg px-4 py-2 ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {message.type === 'assistant' ? (
                    <TypingEffect text={message.content} speed={30} />
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
         {/* Predefined Messages */}
         <div className="flex flex-wrap gap-2 text-center ml-60 mb-5">
          {predefinedMessages.map((message, index) => (
            <button
              key={index}
              onClick={() => handlePredefinedMessage(message)}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
            >
              {message}
            </button>
          ))}
        </div>
        <div className="max-w-3xl mx-auto relative">
          <textarea
            ref={textareaRef}
            value={textInput}
            onChange={(e) => {
              setTextInput(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyPress={handleKeyPress}
            placeholder="Message AI Agent..."
            className="w-full resize-none bg-gray-100 rounded-lg pl-4 pr-24 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-36"
            rows={1}
            disabled={isLoading}
          />
          <div className="absolute right-2 bottom-4 flex items-center space-x-2">
            <button
              onClick={recorder ? stopRecording : startRecording}
              disabled={isLoading}
              className="p-1.5 hover:bg-gray-200 rounded-full"
            >
              {recorder ? (
                <StopCircle className="w-5 h-5 text-red-500" />
              ) : (
                <Mic className="w-5 h-5 text-gray-500" />
              )}
            </button>
            <button
              onClick={sendTextMessage}
              disabled={isLoading || !textInput.trim()}
              className={`p-1.5 rounded-full ${
                isLoading || !textInput.trim()
                  ? 'text-gray-400 hover:bg-gray-200'
                  : 'text-blue-500 hover:bg-blue-100'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={audioUrl} onEnded={handleAudioEnd}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default ChatInterface;