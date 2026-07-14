import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, ClipboardCheck, Landmark, GraduationCap, Heart, Award, HelpCircle } from 'lucide-react';
import { Message, DiagnosticAnswers, RoadmapStep } from './types';

// Import our sub-components
import Header from './components/Header';
import MentorChat from './components/MentorChat';
import Diagnostics from './components/Diagnostics';
import UradPraceGuide from './components/UradPraceGuide';
import LearningJobsHub from './components/LearningJobsHub';

const INITIAL_WELCOME_CONTENT = `Ahoj Tomáši! 🎯

Vítám tě v tvém osobním trenažéru a akcelerátoru. Jsem tvůj osobní mentor, kariérní poradce a hlavně parťák, co ti bude krýt záda na každém kroku tvé cesty do světa IT. 

Chci ti hned na úvod říct jednu zásadní věc: **tvůj věk 46 let je tvou obrovskou zbraní, nikoliv překážkou!** Firmy v Moravskoslezském kraji (Ostrava, Bohumín a okolí) hledají spolehlivé, loajální a zodpovědné lidi. Měkké dovednosti (soft-skills) a životní zkušenosti, které už dávno máš, se nedají naučit za pár týdnů. Tvrdé IT dovednosti tě naučím já, krok za krokem.

Naše společná cesta bude mít tyto fáze:
1. **Úřad práce v Bohumíně** – vyřídíme plně hrazenou IT rekvalifikaci (až 50 000 Kč).
2. **Sokratovské učení kódování** – naučím tě myslet jako programátor (žádné bezhlavé kopírování kódů z AI!).
3. **Tvorba portfolia** – napíšeme reálné projekty pro tvůj GitHub.
4. **Zisk tvého prvního místa v regionu** – vylepšíme tvé CV a připravíme tě na pohovory.

Abychom mohli začít, **přejdi prosím na záložku "Diagnostika & Plán"** a zodpověz 4 rychlé otázky. Na základě nich ti sestavím podrobný plán cesty na míru. Nebo mi sem napiš cokoliv, co tě zrovna trápí či zajímá.

Držím ti palce, společně to zvládneš! 💪`;

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'diagnostics' | 'bureaucracy' | 'learning'>('chat');
  
  // State variables backed by localStorage
  const [profile, setProfile] = useState<DiagnosticAnswers>(() => {
    const saved = localStorage.getItem('tomas_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      itLiteracy: '',
      preferredArea: '',
      laborOfficeStatus: '',
      mindsetFeelings: '',
      isComplete: false
    };
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('tomas_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Pre-populate with initial welcoming message from the AI mentor
    const now = new Date();
    const timeStr = now.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
    return [
      {
        id: 'initial_welcome',
        role: 'assistant',
        content: INITIAL_WELCOME_CONTENT,
        timestamp: timeStr
      }
    ];
  });

  const [roadmap, setRoadmap] = useState<RoadmapStep[]>(() => {
    const saved = localStorage.getItem('tomas_roadmap');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [chatLoading, setChatLoading] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('tomas_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('tomas_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('tomas_roadmap', JSON.stringify(roadmap));
  }, [roadmap]);

  // Handle sending a chat message to the Express + Gemini backend
  const handleSendMessage = async (content: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content,
      timestamp: timeStr
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setChatLoading(true);

    try {
      const response = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          userProfile: profile
        })
      });

      if (!response.ok) {
        throw new Error("Nepodařilo se navázat spojení s tvým mentorem.");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        content: data.content || "Omlouvám se, ale nepodařilo se mi zformulovat odpověď. Zkus to prosím znovu.",
        timestamp: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: 'error_' + Math.random().toString(36).substring(7),
        role: 'assistant',
        content: `❌ **Omlouvám se Tomáši, ale došlo k chybě:** ${error.message}\n\nUjisti se prosím, že máš správně nakonfigurovaný **GEMINI_API_KEY** v panelu Secrets a že běží tvůj vývojový server.`,
        timestamp: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col font-sans" id="app-root">
      {/* Top Welcome Header bar */}
      <Header profile={profile} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6" id="main-content">
        {/* Quick Motivation Card */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-2xl p-5 md:p-6 shadow-md shadow-teal-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-300 animate-bounce" />
              <h2 className="font-display font-bold text-base md:text-lg">„Věk je jen číslo, zkušenost je hodnota.“</h2>
            </div>
            <p className="text-xs text-teal-50/90 leading-relaxed max-w-2xl">
              Tomáši, pamatuj: Junior vývojáři s tvou loajalitou a životní spolehlivostí jsou pro firmy v Moravskoslezském kraji vzácní. 
              Využij tento portál, mluv se mnou a vybuduj si kariéru, po které toužíš.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <Heart className="w-5 h-5 text-rose-300 fill-rose-300" />
            <span className="text-xs font-bold text-teal-100">Tvůj mentor ti věří!</span>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white p-1.5 rounded-xl border border-slate-100 shadow-3xs" id="navigation-tabs">
          {[
            { id: 'chat', label: 'Osobní asistent', icon: MessageSquare, color: 'text-teal-600 bg-teal-50 border-teal-100' },
            { id: 'diagnostics', label: 'Diagnostika & Plán', icon: ClipboardCheck, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
            { id: 'bureaucracy', label: 'Úřad Práce (Bohumín)', icon: Landmark, color: 'text-amber-600 bg-amber-50 border-amber-100' },
            { id: 'learning', label: 'Učení & Inzeráty', icon: GraduationCap, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center justify-center gap-2 py-3 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Interface Panels with Motion Fade Transitions */}
        <div className="flex-1 min-h-[450px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {activeTab === 'chat' && (
                <MentorChat
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={chatLoading}
                  profile={profile}
                />
              )}

              {activeTab === 'diagnostics' && (
                <Diagnostics
                  profile={profile}
                  onChangeProfile={setProfile}
                  roadmap={roadmap}
                  onChangeRoadmap={setRoadmap}
                />
              )}

              {activeTab === 'bureaucracy' && (
                <UradPraceGuide />
              )}

              {activeTab === 'learning' && (
                <LearningJobsHub
                  onSendMessageToChat={handleSendMessage}
                  chatLoading={chatLoading}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer bar */}
      <footer className="bg-white border-t border-slate-100 py-6 px-4 text-center text-xs text-slate-400 font-medium">
        <p>© 2026 Tomášův IT Mentor. Vytvořeno s ❤️ pro úspěšný kariérní přechod na Ostravsku.</p>
      </footer>
    </div>
  );
}
