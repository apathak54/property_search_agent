// ExplorePage.tsx
import React, { useState, useRef, useEffect } from 'react';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp?: string;
}

const ExplorePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getCurrentTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleAIQuery = () => {
    if (!searchTerm.trim()) return;
    setLoading(true);

    const userMessage: Message = { sender: 'user', text: searchTerm, timestamp: getCurrentTimestamp() };
    setChatHistory((prev) => [...prev, userMessage]);

    fetch(`/api/ai-search?q=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => {
        const aiMessage: Message = {
          sender: 'ai',
          text: data?.response || 'No result found.',
          timestamp: getCurrentTimestamp()
        };
        setChatHistory((prev) => [...prev, aiMessage]);
        setLoading(false);
      })
      .catch(() => {
        const aiMessage: Message = {
          sender: 'ai',
          text: 'Something went wrong.',
          timestamp: getCurrentTimestamp()
        };
        setChatHistory((prev) => [...prev, aiMessage]);
        setLoading(false);
      });

    setSearchTerm('');
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm((prev) => prev + ' ' + transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAIQuery();
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 to-white flex flex-col justify-end items-center pb-6 px-4">
      {/* Chat Section */}
      <div className="flex-1 w-full max-w-3xl mb-4 space-y-4">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[80%] text-left break-words whitespace-pre-wrap relative text-sm sm:text-base ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.text}
              <div className="text-xs text-gray-500 mt-1 text-right">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 flex items-center gap-2">
              <CircularProgress size={16} thickness={5} />
              <span>Typing...</span>
            </div>
          </div>
        )}
        <div ref={chatRef} />
      </div>

      {/* Static Search Bar */}
      <div className="w-full max-w-3xl relative">
        <textarea
          ref={textareaRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Property AI..."
          rows={1}
          className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-600 shadow resize-none overflow-hidden"
          style={{ minHeight: '3.5rem', maxHeight: '30vh' }}
        />

        {/* Mic Button */}
        <button
          onClick={handleVoiceInput}
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 transition duration-300 ease-in-out ${
            isListening ? 'text-red-500 animate-[pulse_1s_infinite]' : 'hover:text-blue-600'
          }`}
        >
          <MicIcon fontSize="medium" />
        </button>

        {/* Send Button */}
        <button
          onClick={handleAIQuery}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-600 transition"
        >
          <SendIcon fontSize="medium" />
        </button>
      </div>
    </div>
  );
};

export default ExplorePage;
