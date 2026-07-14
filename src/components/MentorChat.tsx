import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, HelpCircle, AlertCircle, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message, DiagnosticAnswers } from '../types';

interface MentorChatProps {
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  profile: DiagnosticAnswers;
}

const QUICK_SUGGESTIONS = [
  {
    title: "Obavy z věku 46 let",
    text: "Mám obavy z věku 46 let. Není už na změnu kariéry do IT pozdě?",
    short: "Mám obavy z věku (46)"
  },
  {
    title: "Argumenty pro Úřad Práce",
    text: "Jaké přesvědčivé argumenty mám použít na Úřadu práce v Bohumíně pro schválení kurzu?",
    short: "Argumenty na Úřad práce"
  },
  {
    title: "Co je to 'Vibecoding'?",
    text: "Co přesně znamená moderní 'Vibecoding' s AI a jak mi pomůže začít rychleji?",
    short: "Co je Vibecoding?"
  },
  {
    title: "Jak se učit Sokratovsky",
    text: "Jak bude vypadat naše Sokratovské učení programování? Bojím se, že se ztratím.",
    short: "Sokratovské učení"
  }
];

export default function MentorChat({ messages, onSendMessage, isLoading, profile }: MentorChatProps) {
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  const handleSuggestionClick = (text: string) => {
    if (isLoading) return;
    onSendMessage(text);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] min-h-[500px] bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shadow-xs" id="mentor-chat-panel">
      {/* Chat header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 font-semibold shrink-0">
            🤖
          </div>
          <div>
            <h2 className="font-display font-bold text-slate-800 text-base leading-tight">Můj Osobní Mentor</h2>
            <p className="text-xs text-emerald-600 flex items-center gap-1.5 mt-0.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Připraven ti pomoct a motivovat tě
            </p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 text-2xl mb-4 shadow-sm">
              💬
            </div>
            <h3 className="font-display font-bold text-lg text-slate-800 mb-2">Ahoj Tomáši! Jsem tvůj IT průvodce</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Vítej ve své nové etapě! Jsem tu, abych ti pomohl překonat byrokracii na Úřadu práce v Bohumíně,
              naučil tě programovat moderním způsobem a podpořil tě v těžkých chvílích.
            </p>
            
            <div className="w-full text-left space-y-2.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Zkus se mě zeptat na:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {QUICK_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(sug.text)}
                    disabled={isLoading}
                    className="p-3 text-left bg-white hover:bg-teal-50 border border-slate-100 hover:border-teal-200 rounded-xl transition text-xs font-medium text-slate-700 hover:text-teal-900 shadow-2xs hover:shadow-xs cursor-pointer flex items-start gap-2 group"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-400 group-hover:text-teal-600 shrink-0 mt-0.5" />
                    <span>{sug.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 max-w-[85%] ${isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border select-none text-sm ${
                    isAssistant 
                      ? 'bg-teal-50 border-teal-100 text-teal-600 font-semibold' 
                      : 'bg-indigo-50 border-indigo-100 text-indigo-600'
                  }`}>
                    {isAssistant ? '🤖' : '👨'}
                  </div>

                  {/* Message Bubble */}
                  <div className={`rounded-2xl px-4 py-3 shadow-2xs ${
                    isAssistant 
                      ? 'bg-white border border-slate-100 text-slate-800' 
                      : 'bg-teal-600 text-white'
                  }`}>
                    {isAssistant ? (
                      <div className="markdown-body text-sm leading-relaxed space-y-2 prose prose-slate">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    )}
                    <span className={`text-[10px] mt-1 block text-right ${
                      isAssistant ? 'text-slate-400' : 'text-teal-200'
                    }`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3.5 mr-auto max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 text-teal-600 font-semibold text-sm">
                  🤖
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl px-5 py-3.5 shadow-2xs flex items-center gap-3">
                  <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />
                  <span className="text-xs text-slate-500 font-medium">Tvůj parťák přemýšlí...</span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Floating hints above input when messages exist */}
      {messages.length > 0 && (
        <div className="bg-white border-t border-slate-100 px-6 py-2 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Rychlé dotazy:</span>
          {QUICK_SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(sug.text)}
              disabled={isLoading}
              className="text-xs bg-slate-50 hover:bg-teal-50 hover:text-teal-800 border border-slate-100 hover:border-teal-200 text-slate-600 px-3 py-1.5 rounded-full transition cursor-pointer font-medium"
            >
              {sug.short}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="bg-white border-t border-slate-100 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Napiš svému mentorovi..."
            className="flex-1 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-3 text-sm text-slate-800 outline-hidden transition focus:ring-2 focus:ring-teal-100"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-medium text-sm rounded-xl px-4.5 py-3 transition flex items-center justify-center shrink-0 cursor-pointer shadow-sm disabled:shadow-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center gap-1.5 justify-center mt-2.5 text-[11px] text-slate-400">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>Sokratovský režim aktivní: pomáhám ti přijít na řešení vlastním přemýšlením!</span>
        </div>
      </div>
    </div>
  );
}
