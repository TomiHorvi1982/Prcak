import React, { useState } from 'react';
import { BookOpen, Code2, AlertCircle, ArrowRight, Play, Loader2, Sparkles, Send, FileText, CheckCircle } from 'lucide-react';
import { Challenge, JobAnalysis } from '../types';

const CHALLENGES: Challenge[] = [
  {
    id: 'challenge_1',
    title: "1. Python: Smyčka s výpisem čísel",
    difficulty: "Začátečník",
    language: "Python",
    description: "Napiš jednoduchou smyčku (cyklus), která projde čísla od 1 do 10 a vypíše je do konzole. Použij cyklus 'for' a vestavěnou funkci 'range'.",
    initialCode: "# Zde napiš svůj kód v Pythonu:\nfor i in ...\n    print(...)",
    socraticQuestions: [
      "Jak funguje funkce range()? Jaké parametry přijímá, aby začala od 1?",
      "Nezapomněl jsi na správné odsazení (indentaci) v Pythonu?",
      "Co se stane, pokud napíšeš range(10)? Bude vypsáno i číslo 10?"
    ]
  },
  {
    id: 'challenge_2',
    title: "2. JavaScript: Podmínka pro kontrolu věku",
    difficulty: "Začátečník",
    language: "JavaScript",
    description: "Napiš funkci 'zkontrolujVek(vek)', která vrátí text 'Plnoletý', pokud je věk větší nebo roven 18, a 'Nezletilý' v opačném případě.",
    initialCode: "function zkontrolujVek(vek) {\n  // Sem doplň podmínku if/else\n}",
    socraticQuestions: [
      "Jaký operátor v JavaScriptu slouží k porovnání 'větší nebo rovno'?",
      "Jak správně zapsat strukturu if/else?",
      "Co funkce vrátí, pokud jako parametr předáme přesně číslo 18?"
    ]
  },
  {
    id: 'challenge_3',
    title: "3. Git: Jak poslat kód na GitHub",
    difficulty: "Mírně pokročilý",
    language: "Git",
    description: "Změnil jsi soubory ve svém projektu. Jaké jsou přesné 3 příkazy Gitu, které musíš postupně napsat v terminálu, abys změny uložil (zabouchl) a nahrál (pushnul) do svého repozitáře na GitHubu?",
    initialCode: "# Napiš 3 příkazy pod sebe:\n1. git ...\n2. git ...\n3. git ...",
    socraticQuestions: [
      "Kterým příkazem přidáš soubory do takzvané 'scénické' (staging) oblasti?",
      "Jak napíšeš commit s popisem (zprávou) o tom, co jsi změnil?",
      "Jak se jmenuje příkaz, který odešle tvou práci z lokálního počítače na server?"
    ]
  }
];

// Default sample job analysis to load if they want to test
const SAMPLE_JOB_TEXT = `Hledáme Junior Frontend Vývojáře do našeho týmu v Ostravě!
Co u nás budeš dělat:
- Vývoj uživatelského rozhraní našich webových aplikací.
- Spolupráce s designéry a backend vývojáři.
Požadujeme:
- Základní znalost HTML5, CSS3 (výhodou Tailwind).
- Znalost JavaScriptu (ES6+), základy Reactu jsou vítány.
- Chuť učit se nové věci a logické myšlení.
- Znalost Git pro správu verzí.
Nabízíme:
- Skvělý tým na pobočce v Ostravě, možnost občasné práce z domova (home office).
- Možnost profesního růstu, zaučení od seniorních kolegů.
- Vhodné i pro talentované absolventy a lidi po rekvalifikaci!`;

interface LearningJobsHubProps {
  onSendMessageToChat: (content: string) => Promise<void>;
  chatLoading: boolean;
}

export default function LearningJobsHub({ onSendMessageToChat, chatLoading }: LearningJobsHubProps) {
  const [activeTab, setActiveTab] = useState<'coding' | 'jobs'>('coding');
  
  // Coding Challenge State
  const [selectedChallengeId, setSelectedChallengeId] = useState(CHALLENGES[0].id);
  const [userCode, setUserCode] = useState(CHALLENGES[0].initialCode);
  const [socraticFeedback, setSocraticFeedback] = useState('');
  const [submittingCode, setSubmittingCode] = useState(false);

  // Job Analyzer State
  const [jobInput, setJobInput] = useState('');
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null);
  const [analyzingJob, setAnalyzingJob] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  const currentChallenge = CHALLENGES.find(c => c.id === selectedChallengeId) || CHALLENGES[0];

  const handleChallengeChange = (id: string) => {
    setSelectedChallengeId(id);
    const challenge = CHALLENGES.find(c => c.id === id);
    if (challenge) {
      setUserCode(challenge.initialCode);
      setSocraticFeedback('');
    }
  };

  const handleSubmitCode = async () => {
    if (!userCode.trim()) return;
    setSubmittingCode(true);
    setSocraticFeedback('');

    try {
      const prompt = `Ahoj mentore! Snažím se vyřešit cvičení: "${currentChallenge.title}".
      Moje řešení je následující:
      \`\`\`${currentChallenge.language.toLowerCase()}
      ${userCode}
      \`\`\`
      
      Můžeš ohodnotit můj kód striktně SOKRATOVSKOU METODOU v češtině?
      Napiš mi prosím:
      1. Co dělám dobře.
      2. Nasměruj mě nápovědami nebo otázkami, kde dělám chyby nebo co mohu zlepšit (nepiš mi hotový kód!).
      3. Zeptej se mě na kontrolní otázku k tomuto tématu.`;

      // Make API call to backend chat route to get a structured Socratic reply
      const response = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ role: 'user', content: prompt }] 
        }),
      });

      if (!response.ok) {
        throw new Error("Nepodařilo se odeslat kód k posouzení.");
      }

      const data = await response.json();
      setSocraticFeedback(data.content || "Chyba při vyhodnocení.");
    } catch (err: any) {
      setSocraticFeedback(`❌ Došlo k chybě při odesílání: ${err.message}. Ujisti se, že máš správně nastavený GEMINI_API_KEY.`);
    } finally {
      setSubmittingCode(false);
    }
  };

  const handleAnalyzeJob = async (textToAnalyze: string) => {
    const rawText = textToAnalyze || jobInput;
    if (!rawText.trim()) return;

    setAnalyzingJob(true);
    setAnalysisError('');
    setJobAnalysis(null);

    try {
      const response = await fetch('/api/mentor/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobText: rawText }),
      });

      if (!response.ok) {
        throw new Error("Analýza inzerátu selhala.");
      }

      const data = await response.json();
      setJobAnalysis(data);
    } catch (err: any) {
      setAnalysisError(`❌ Selhalo spojení se serverem: ${err.message}. Zkontroluj nastavení API klíče.`);
    } finally {
      setAnalyzingJob(false);
    }
  };

  const handleLoadSampleJob = () => {
    setJobInput(SAMPLE_JOB_TEXT);
    handleAnalyzeJob(SAMPLE_JOB_TEXT);
  };

  return (
    <div className="space-y-6" id="learning-jobs-panel">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActiveTab('coding')}
          className={`px-5 py-3 font-display font-bold text-sm border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'coding'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Sokratovský trenažér kódování
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-5 py-3 font-display font-bold text-sm border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'jobs'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Analyzátor inzerátů (Ostravsko)
        </button>
      </div>

      {activeTab === 'coding' ? (
        // Coding Challenges Tab
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Challenge Select & Info */}
          <div className="space-y-4 lg:col-span-1">
            <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-2xs">
              <h3 className="font-display font-bold text-slate-800 text-sm mb-3">Vyber si cvičení:</h3>
              <div className="space-y-2">
                {CHALLENGES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleChallengeChange(c.id)}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition cursor-pointer ${
                      selectedChallengeId === c.id
                        ? 'border-teal-500 bg-teal-50/50 font-bold text-teal-900'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">
                        {c.language}
                      </span>
                      <span className="text-[10px] text-teal-600 font-semibold">{c.difficulty}</span>
                    </div>
                    <div>{c.title}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Socratic Hint */}
            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-5">
              <h4 className="font-display font-bold text-amber-800 text-xs flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Jak na sokratovské učení?
              </h4>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                Napiš svůj kód nebo popiš řešení vlastními slovy. Náš mentor ti neprozradí kompletní výsledek,
                ale navede tě správným směrem, abys na to přišel sám. To je jediná cesta, jak se programování skutečně naučit!
              </p>
            </div>
          </div>

          {/* Right: Code Editor & Mentor Feedback */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-2xs">
              {/* Editor Header */}
              <div className="bg-slate-950 px-5 py-3.5 flex items-center justify-between text-white border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs font-mono text-slate-400 ml-2">{currentChallenge.language.toLowerCase()}_cviceni.py</span>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                  UTF-8
                </span>
              </div>

              {/* Editor Box */}
              <div className="p-4 bg-slate-900">
                <p className="text-slate-300 text-xs mb-3 font-semibold leading-relaxed">
                  💡 {currentChallenge.description}
                </p>
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="w-full h-44 bg-slate-950 text-emerald-400 font-mono text-xs p-4 rounded-lg border border-slate-800 focus:outline-hidden focus:border-teal-500 leading-relaxed resize-none"
                  style={{ tabSize: 4 }}
                />
              </div>

              {/* Editor footer / controls */}
              <div className="bg-slate-50 border-t border-slate-100 p-3.5 flex justify-between items-center flex-wrap gap-2">
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <span>Kontrolní otázky mentora najdeš pod řešením.</span>
                </div>
                
                <button
                  onClick={handleSubmitCode}
                  disabled={submittingCode || !userCode.trim()}
                  className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-medium text-xs px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-sm disabled:shadow-none"
                >
                  {submittingCode ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Mentor hodnotí...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      Odeslat mentorovi
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Socratic Questions / Checklist helper */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Kontrolní otázky pro tvou inspiraci:</h4>
              <ul className="space-y-2">
                {currentChallenge.socraticQuestions.map((q, idx) => (
                  <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                    <span className="text-teal-600 font-bold shrink-0">?</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mentor Socratic Feedback Box */}
            {socraticFeedback && (
              <div className="bg-teal-50/20 border border-teal-100 rounded-xl p-6 relative animate-fadeIn">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-teal-50">
                  <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-sm font-bold text-teal-600 shrink-0">
                    🤖
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-800">Sokratovské posouzení mentora</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Analýza tvého kódu proběhla úspěšně</p>
                  </div>
                </div>
                <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap space-y-2">
                  {socraticFeedback}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Job Analyzer Tab
        <div className="space-y-6">
          <div className="bg-white border border-slate-150 rounded-xl p-6 shadow-2xs">
            <h3 className="font-display font-bold text-slate-800 text-sm mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-600" />
              Chytrý analyzátor pracovních inzerátů
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Našel jsi inzerát na juniora na Jobs.cz, Prace.cz nebo jinde v Moravskoslezském kraji? Zkopíruj sem jeho text!
              Náš AI model ho rozebere a sestaví ti přesný technologický plán a návrhy projektů, které pro tuto pozici musíš mít v portfoliu.
            </p>

            <textarea
              value={jobInput}
              onChange={(e) => setJobInput(e.target.value)}
              placeholder="Sem zkopíruj celý text pracovního inzerátu..."
              className="w-full h-40 bg-slate-50 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl p-4 text-xs text-slate-800 outline-hidden transition focus:ring-2 focus:ring-teal-100 leading-relaxed resize-none mb-4"
            />

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => handleAnalyzeJob(jobInput)}
                disabled={analyzingJob || !jobInput.trim()}
                className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-medium text-xs px-4 py-2.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-sm disabled:shadow-none"
              >
                {analyzingJob ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Analyzuji inzerát...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Analyzovat inzerát přes AI
                  </>
                )}
              </button>

              <button
                onClick={handleLoadSampleJob}
                disabled={analyzingJob}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium text-xs px-4 py-2.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
              >
                Načíst ukázkový inzerát z Ostravy
              </button>
            </div>

            {analysisError && (
              <p className="text-xs text-red-600 font-semibold mt-3">{analysisError}</p>
            )}
          </div>

          {/* Job Analysis Display */}
          {jobAnalysis && (
            <div className="bg-white border border-slate-150 rounded-xl p-6 shadow-2xs space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded border border-teal-100">
                  AI Výsledek analýzy inzerátu
                </span>
                <h3 className="font-display font-bold text-lg text-slate-800 mt-3">{jobAnalysis.title}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Firma: <strong>{jobAnalysis.company}</strong> | Lokalita: <strong>{jobAnalysis.location}</strong>
                </p>
              </div>

              {/* Tech Stack Required */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2.5">Požadovaný technologický stack:</h4>
                <div className="flex flex-wrap gap-2">
                  {jobAnalysis.techStack.map((tech, idx) => (
                    <span key={idx} className="text-xs bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1 rounded-md font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Local Demand Assessment */}
              <div className="bg-teal-50/20 border border-teal-50 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">Poptávka a uplatnění v Moravskoslezském kraji:</h4>
                <p className="text-xs text-slate-700 leading-relaxed">{jobAnalysis.localDemandCzech}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Recommendations */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    Kroky pro splnění požadavků:
                  </h4>
                  <ul className="space-y-2">
                    {jobAnalysis.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="text-teal-600 font-bold shrink-0">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggested Portfolio Projects */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Navržené projekty do tvého portfolia:
                  </h4>
                  <ul className="space-y-3">
                    {jobAnalysis.suggestedProjects.map((proj, idx) => (
                      <li key={idx} className="text-xs text-slate-600">
                        <div className="font-semibold text-slate-800">Projekt #{idx + 1}</div>
                        <p className="mt-1 leading-relaxed">{proj}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
