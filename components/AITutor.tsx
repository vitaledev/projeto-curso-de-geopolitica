import React, { useState, useRef, useEffect } from 'react';
import { IconBot } from './Icons';
import { askGeopoliticsTutor } from '../services/gemini';

interface AITutorProps {
  currentContext: string;
}

export const AITutor: React.FC<AITutorProps> = ({ currentContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Saudações, estrategista. Sou sua IA de inteligência tática. Alguma dúvida sobre a aula?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const answer = await askGeopoliticsTutor(userMsg, currentContext);
    
    setMessages(prev => [...prev, { role: 'ai', text: answer }]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg z-50 transition-all duration-300 transform hover:scale-110 ${
          isOpen ? 'bg-geo-danger rotate-45' : 'bg-geo-accent animate-float'
        } text-white border-2 border-white/20`}
      >
        <IconBot className="w-8 h-8" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-geo-card border border-slate-600 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden font-sans">
          <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-display font-bold text-geo-accent text-lg flex items-center gap-2">
              <IconBot className="w-5 h-5" />
              IA Estratégica
            </h3>
            <span className="text-xs text-slate-400 uppercase tracking-widest">Online</span>
          </div>

          <div className="flex-1 h-80 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-geo-accent text-white rounded-br-none' 
                    : 'bg-slate-700 text-slate-200 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 p-3 rounded-lg rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-slate-800 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pergunte sobre geopolítica..."
                className="flex-1 bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-geo-accent placeholder-slate-500"
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className="bg-geo-accent hover:bg-blue-600 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors disabled:opacity-50"
              >
                ENV
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};