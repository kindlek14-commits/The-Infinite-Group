
import React, { useState, useEffect } from 'react';
import { handleAssistantQuery } from '../services/geminiService';

const Assistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [signature, setSignature] = useState(() => {
    return localStorage.getItem('infinite_ai_signature') || 
    `The Infinite Group Management Team
1500 N. Grant St. Suite C, Aurora, Co. 80203
Phone: 720.271.3556
Email: admin@theinfintegroup.net`;
  });

  useEffect(() => {
    localStorage.setItem('infinite_ai_signature', signature);
  }, [signature]);

  const onSend = async () => {
    if (!query.trim()) return;
    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const botRes = await handleAssistantQuery(userMsg, signature);
      setMessages(prev => [...prev, { role: 'bot', text: botRes || "I'm having trouble connecting." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "Error connecting to AI service." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60]">
      {isOpen ? (
        <div className="bg-black border border-[#D4AF37] rounded-xl w-80 shadow-2xl overflow-hidden flex flex-col h-96">
          <div className="bg-[#1B3022] p-4 flex justify-between items-center border-b border-[#D4AF37]/30">
            <div className="flex items-center space-x-2">
              <span className="text-[#D4AF37] font-serif font-bold">
                {isSettingsOpen ? 'Assistant Settings' : 'Infinite Assistant'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
                className={`transition-colors ${isSettingsOpen ? 'text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'}`}
                title="AI Settings"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-[#D4AF37]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {isSettingsOpen ? (
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-black/50">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-widest">Custom AI Signature</label>
                <p className="text-[10px] text-gray-600 mb-3 italic">This signature will be appended to all AI-generated notices and formal communications.</p>
                <textarea 
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded p-3 text-xs text-gray-300 focus:border-[#D4AF37] outline-none resize-none h-48 custom-scrollbar"
                  placeholder="Enter custom signature..."
                />
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="w-full bg-[#D4AF37] text-black py-2 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-[#B89630] transition-colors"
              >
                Save & Close Settings
              </button>
            </div>
          ) : (
            <>
              <div className="flex-grow p-4 overflow-y-auto space-y-4 custom-scrollbar">
                {messages.length === 0 && (
                  <p className="text-gray-500 text-sm italic text-center mt-4">How can I assist you with your property needs today?</p>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 text-xs shadow-sm ${
                      m.role === 'user' ? 'bg-[#D4AF37] text-black rounded-tr-none' : 'bg-[#1B3022] text-gray-200 rounded-tl-none'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-[#1B3022] text-gray-500 rounded-lg p-3 text-xs italic rounded-tl-none">Thinking...</div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-white/10 flex space-x-2 bg-black">
                <input 
                  type="text" 
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && onSend()}
                  placeholder="Ask anything..."
                  className="flex-grow bg-[#111] text-white text-xs p-2 rounded outline-none border border-white/5 focus:border-[#D4AF37]"
                />
                <button onClick={onSend} className="text-[#D4AF37] hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#D4AF37] text-black p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <div className="absolute -top-12 right-0 bg-white text-black text-[10px] font-bold px-3 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Need Help? Chat with AI
          </div>
        </button>
      )}
    </div>
  );
};

export default Assistant;
