import React, { useState } from 'react';
import { CheckCircle2, Circle, ArrowRight, ArrowLeft, RefreshCw, Sparkles, BookOpen, UserCheck, Briefcase, Award } from 'lucide-react';
import { DiagnosticAnswers, RoadmapStep } from '../types';

interface DiagnosticsProps {
  profile: DiagnosticAnswers;
  onChangeProfile: (updated: DiagnosticAnswers) => void;
  roadmap: RoadmapStep[];
  onChangeRoadmap: (updated: RoadmapStep[]) => void;
}

export default function Diagnostics({ profile, onChangeProfile, roadmap, onChangeRoadmap }: DiagnosticsProps) {
  const [step, setStep] = useState(1);

  const handleSelectOption = (key: keyof DiagnosticAnswers, value: string) => {
    onChangeProfile({
      ...profile,
      [key]: value
    });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Complete diagnostics, generate or update roadmap
      onChangeProfile({
        ...profile,
        isComplete: true
      });
      // Generate custom roadmap based on profile choices
      generateCustomRoadmap();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    if (window.confirm("Opravdu chceš resetovat svou diagnostiku a začít znovu?")) {
      onChangeProfile({
        itLiteracy: '',
        preferredArea: '',
        laborOfficeStatus: '',
        mindsetFeelings: '',
        isComplete: false
      });
      setStep(1);
    }
  };

  const generateCustomRoadmap = () => {
    const area = profile.preferredArea || 'web_dev';
    let technicalBasicLabel = "Zvládnutí základů (HTML, CSS, JavaScript)";
    let technicalBasicDesc = "Pochop, jak funguje DOM, proměnné, podmínky, pole a funkce. Vyzkoušej si jednoduché skripty.";
    let technicalProjectLabel = "První interaktivní webová aplikace";
    let technicalProjectDesc = "Naprogramuj kalkulačku nebo plánovač úkolů bez slepého kopírování, s vysvětlením každého řádku kódu.";

    if (area === 'python') {
      technicalBasicLabel = "Základy Pythonu & Automatizace";
      technicalBasicDesc = "Zvl暮らし základní syntaxi, datové struktury (seznamy, slovníky) a psaní jednoduchých funkcí.";
      technicalProjectLabel = "Vlastní automatizační skript";
      technicalProjectDesc = "Vytvoř skript na třídění souborů nebo stahování dat z webu a vysvětli jeho fungování mentoru.";
    } else if (area === 'data_analyst') {
      technicalBasicLabel = "Základy SQL & Práce s daty";
      technicalBasicDesc = "Nauč se filtrovat, seskupovat a spojovat tabulky. Pochop, jak fungují relační databáze.";
      technicalProjectLabel = "Analýza reálného datového souboru";
      technicalProjectDesc = "Importuj tabulku do Pythonu (Pandas) nebo SQL a vygeneruj zajímavé grafické reporty.";
    }

    const defaultSteps: RoadmapStep[] = [
      {
        id: 'step_1',
        title: "Návštěva Úřadu Práce v Bohumíně",
        description: "Osobní návštěva pobočky v Bohumíně (Studentská ulice). Zjisti jméno svého zprostředkovatele a zeptej se na možnosti zvolené rekvalifikace.",
        category: 'bureaucracy',
        status: 'current',
        czechLabel: "Úřad Práce"
      },
      {
        id: 'step_2',
        title: "Výběr kurzu v portálu 'Jsem v kurzu'",
        description: "Najdi vhodný kurz akreditovaný MPSV na portálu mpsv.cz. Vyber takový, který se zaměřuje na moderní kódování s podporou AI (např. Frontend, Python).",
        category: 'bureaucracy',
        status: 'pending',
        czechLabel: "Portál MPSV"
      },
      {
        id: 'step_3',
        title: "Odevzdání formuláře rekvalifikace",
        description: "Vyplň formulář 'Zájemce o zvolenou rekvalifikaci' a odevzdej jej na ÚP v Bohumíně alespoň 30 dní před plánovaným začátkem kurzu. Připrav si argumenty o uplatnění na Ostravsku.",
        category: 'bureaucracy',
        status: 'pending',
        czechLabel: "Formulář rekvalifikace"
      },
      {
        id: 'step_4',
        title: "Příprava vývojářského prostředí",
        description: "Nainstaluj VS Code, založ si účet na GitHubu a nauč se základní Git příkazy (clone, commit, push, pull). Nastav si základy pro psaní kódu.",
        category: 'basics',
        status: 'pending',
        czechLabel: "Git & VS Code"
      },
      {
        id: 'step_5',
        title: technicalBasicLabel,
        description: technicalBasicDesc,
        category: 'basics',
        status: 'pending',
        czechLabel: "Základy programování"
      },
      {
        id: 'step_6',
        title: technicalProjectLabel,
        description: technicalProjectDesc,
        category: 'portfolio',
        status: 'pending',
        czechLabel: "První projekt"
      },
      {
        id: 'step_7',
        title: "Sestavení profesionálního GitHubu",
        description: "Vytvoř si reprezentativní GitHub profil. Každý tvůj projekt musí mít skvěle napsané README.md s popisem a vysvětlením, jak jsi jej tvořil.",
        category: 'portfolio',
        status: 'pending',
        czechLabel: "Prezentace portfolia"
      },
      {
        id: 'step_8',
        title: "Úprava CV se zaměřením na soft-skills",
        description: "Napiš životopis, který vyzdvihne tvých 46 let životních a komunikačních zkušeností. Prezentuj věk jako záruku spolehlivosti a loajality, což firmy v Ostrava oceňují.",
        category: 'jobs',
        status: 'pending',
        czechLabel: "Příprava CV"
      },
      {
        id: 'step_9',
        title: "Cílení na lokální trh (Moravskoslezský kraj)",
        description: "Sestav si seznam 5-10 IT firem v Ostravě a okolí. Přizpůsob své portfolio reálným inzerátům na Jobs.cz / Prace.cz a začni posílat první žádosti.",
        category: 'jobs',
        status: 'pending',
        czechLabel: "Hledání práce"
      }
    ];

    onChangeRoadmap(defaultSteps);
  };

  const toggleStepStatus = (id: string) => {
    const updated = roadmap.map(step => {
      if (step.id === id) {
        let nextStatus: 'pending' | 'current' | 'completed' = 'pending';
        if (step.status === 'pending') nextStatus = 'current';
        else if (step.status === 'current') nextStatus = 'completed';
        else nextStatus = 'pending';
        return { ...step, status: nextStatus };
      }
      return step;
    });
    onChangeRoadmap(updated);
  };

  const getStepProgressPercentage = () => {
    if (roadmap.length === 0) return 0;
    const completed = roadmap.filter(s => s.status === 'completed').length;
    return Math.round((completed / roadmap.length) * 100);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-xs" id="diagnostics-panel">
      {!profile.isComplete ? (
        // Question Wizard
        <div className="max-w-xl mx-auto py-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Rychlá diagnostika</span>
            </div>
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
              Krok {step} ze 4
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full mb-8 overflow-hidden">
            <div 
              className="bg-teal-600 h-1.5 rounded-full transition-all duration-300" 
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>

          {/* Wizard Content */}
          <div className="min-h-[220px]">
            {step === 1 && (
              <div>
                <h3 className="font-display font-bold text-slate-800 text-lg mb-2">Jaká je tvá aktuální úroveň s počítači?</h3>
                <p className="text-xs text-slate-500 mb-6">Pomůže mi to nastavit správné tempo a hloubku vysvětlování.</p>
                <div className="space-y-3">
                  {[
                    { key: 'basic', label: 'Běžný uživatel', desc: 'Pracuji s internetem, e-mailem a Excelem, ale nikdy jsem nepsal kód.' },
                    { key: 'mid', label: 'Pokročilý uživatel', desc: 'Zajímám se o technologie, zvládnu přeinstalovat OS, zkoušel jsem základy HTML.' },
                    { key: 'experienced', label: 'Mám mírné IT zkušenosti', desc: 'Napsal jsem už nějaké skripty, znám logiku, ale chci se tím začít živit.' }
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption('itLiteracy', opt.key)}
                      className={`w-full text-left p-4 rounded-xl border transition cursor-pointer flex justify-between items-center ${
                        profile.itLiteracy === opt.key
                          ? 'border-teal-500 bg-teal-50/50 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{opt.label}</div>
                        <div className="text-xs text-slate-500 mt-1">{opt.desc}</div>
                      </div>
                      {profile.itLiteracy === opt.key ? (
                        <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="font-display font-bold text-slate-800 text-lg mb-2">Která oblast IT tě nejvíc láká a zajímá?</h3>
                <p className="text-xs text-slate-500 mb-6">Směr, kterým se vydáme při učení a tvorbě tvého prvního portfolia.</p>
                <div className="space-y-3">
                  {[
                    { key: 'web_dev', label: 'Moderní tvorba webů (Frontend / Fullstack)', desc: 'HTML, CSS, JavaScript a React. Výsledkem je vizuální a interaktivní web.' },
                    { key: 'python', label: 'Python & Automatizace', desc: 'Psaní skriptů na ulehčení práce, stahování dat, ovládání programů, automatická práce s excelovými tabulkami.' },
                    { key: 'data_analyst', label: 'Datová analýza (SQL & Vizualizace)', desc: 'Práce s databázemi, filtrování velkých dat, grafické přehledy a vyhodnocování.' }
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption('preferredArea', opt.key)}
                      className={`w-full text-left p-4 rounded-xl border transition cursor-pointer flex justify-between items-center ${
                        profile.preferredArea === opt.key
                          ? 'border-teal-500 bg-teal-50/50 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{opt.label}</div>
                        <div className="text-xs text-slate-500 mt-1">{opt.desc}</div>
                      </div>
                      {profile.preferredArea === opt.key ? (
                        <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="font-display font-bold text-slate-800 text-lg mb-2">Jaký je tvůj aktuální stav s Úřadem Práce v Bohumíně?</h3>
                <p className="text-xs text-slate-500 mb-6">Tento krok je zásadní pro získání plně hrazené IT rekvalifikace.</p>
                <div className="space-y-3">
                  {[
                    { key: 'yet_to_visit', label: 'Ještě jsem tam nebyl / Chystám se tam', desc: 'Chci nejdřív zjistit, jak postupovat a co si připravit.' },
                    { key: 'registered', label: 'Jsem registrován na ÚP', desc: 'Jsem evidovaný jako uchazeč nebo zájemce o zaměstnání.' },
                    { key: 'meeting_scheduled', label: 'Mám už schůzku nebo podávám žádost', desc: 'Vyplňuji dokumenty nebo se připravuji na setkání s úředníkem.' },
                    { key: 'approved', label: 'Mám rekvalifikaci schválenou', desc: 'Úřad práce mi kurz schválil a chci se rovnou začít učit.' }
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption('laborOfficeStatus', opt.key)}
                      className={`w-full text-left p-4 rounded-xl border transition cursor-pointer flex justify-between items-center ${
                        profile.laborOfficeStatus === opt.key
                          ? 'border-teal-500 bg-teal-50/50 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{opt.label}</div>
                        <div className="text-xs text-slate-500 mt-1">{opt.desc}</div>
                      </div>
                      {profile.laborOfficeStatus === opt.key ? (
                        <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h3 className="font-display font-bold text-slate-800 text-lg mb-2">Jak se vnitřně cítíš ohledně této velké změny?</h3>
                <p className="text-xs text-slate-500 mb-6">Věř mi, že ve 46 letech je tvůj věk výhodou. Chci ale vědět, kde zapracovat na mindsetu.</p>
                <div className="space-y-3">
                  {[
                    { key: 'excited_but_fear_age', label: 'Mám nadšení, ale bojím se věkové diskriminace', desc: 'Mám strach, že firmy dají přednost mladým čerstvým absolventům.' },
                    { key: 'afraid_of_learning', label: 'Bojím se byrokracie a že učení nepůjde do hlavy', desc: 'Mám pocit, že se těžko soustředím a na úřadech se ztratím.' },
                    { key: 'confident_ready', label: 'Jsem odhodlaný a připravený tvrdě makat', desc: 'Vím, co chci, věřím si a chci se co nejrychleji posunout.' }
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption('mindsetFeelings', opt.key)}
                      className={`w-full text-left p-4 rounded-xl border transition cursor-pointer flex justify-between items-center ${
                        profile.mindsetFeelings === opt.key
                          ? 'border-teal-500 bg-teal-50/50 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{opt.label}</div>
                        <div className="text-xs text-slate-500 mt-1">{opt.desc}</div>
                      </div>
                      {profile.mindsetFeelings === opt.key ? (
                        <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-between mt-8 pt-4 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-medium text-xs transition disabled:opacity-30 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Zpět
            </button>

            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !profile.itLiteracy) ||
                (step === 2 && !profile.preferredArea) ||
                (step === 3 && !profile.laborOfficeStatus) ||
                (step === 4 && !profile.mindsetFeelings)
              }
              className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition cursor-pointer shadow-sm disabled:shadow-none"
            >
              {step === 4 ? 'Generovat plán cesty' : 'Pokračovat'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        // Milestone Roadmap Dashboard
        <div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
                Tvá osobní mapa úspěchu 🗺️
              </span>
              <h2 className="font-display font-bold text-2xl text-slate-800 mt-2">Tomášův kariérní plán</h2>
              <p className="text-xs text-slate-500 mt-1">
                Postupuj krok po kroku. Kliknutím na milník můžeš změnit jeho stav (Čeká ➔ Pracuji na tom ➔ Hotovo).
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Progress counter */}
              <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 flex items-center gap-4 shrink-0">
                <div className="text-xs text-slate-500 font-medium">Celkový pokrok:</div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${getStepProgressPercentage()}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-slate-800">{getStepProgressPercentage()}%</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-1.5 text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-100 hover:bg-red-50 font-medium text-xs px-3 py-2.5 rounded-xl transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Nová diagnostika
              </button>
            </div>
          </div>

          {/* Interactive Roadmap Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bureaucracy Milestones */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2 pb-2 border-b border-slate-100 uppercase tracking-wider text-slate-400">
                <UserCheck className="w-4 h-4 text-amber-500" />
                1. Úřad práce & Rekvalifikace
              </h3>
              {roadmap.filter(s => s.category === 'bureaucracy').map(step => (
                <RoadmapCard key={step.id} step={step} onToggle={() => toggleStepStatus(step.id)} />
              ))}
            </div>

            {/* Technical Basics Milestones */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2 pb-2 border-b border-slate-100 uppercase tracking-wider text-slate-400">
                <BookOpen className="w-4 h-4 text-teal-500" />
                2. Sokratovské učení kódování
              </h3>
              {roadmap.filter(s => s.category === 'basics').map(step => (
                <RoadmapCard key={step.id} step={step} onToggle={() => toggleStepStatus(step.id)} />
              ))}
            </div>

            {/* Portfolio & Job Hunting */}
            <div className="space-y-4 md:col-span-2 lg:col-span-1">
              <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2 pb-2 border-b border-slate-100 uppercase tracking-wider text-slate-400">
                <Briefcase className="w-4 h-4 text-indigo-500" />
                3. Portfolio & Práce v regionu
              </h3>
              <div className="space-y-4">
                {/* Portfolio Steps */}
                {roadmap.filter(s => s.category === 'portfolio').map(step => (
                  <RoadmapCard key={step.id} step={step} onToggle={() => toggleStepStatus(step.id)} />
                ))}
                {/* Job Search Steps */}
                {roadmap.filter(s => s.category === 'jobs').map(step => (
                  <RoadmapCard key={step.id} step={step} onToggle={() => toggleStepStatus(step.id)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component: Individual Roadmap Step Card
function RoadmapCard({ step, onToggle }: { step: RoadmapStep; onToggle: () => void }) {
  const getStatusStyle = () => {
    switch (step.status) {
      case 'completed':
        return {
          border: 'border-emerald-200 bg-emerald-50/25',
          indicator: 'bg-emerald-500 text-white border-emerald-500',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          badgeText: 'Splněno'
        };
      case 'current':
        return {
          border: 'border-teal-400 bg-teal-50/20 ring-2 ring-teal-50/50',
          indicator: 'bg-teal-600 text-white border-teal-600',
          badge: 'bg-teal-100 text-teal-800 border-teal-200',
          badgeText: 'Pracuji na tom'
        };
      default:
        return {
          border: 'border-slate-100 bg-slate-50/50',
          indicator: 'bg-white text-slate-400 border-slate-200',
          badge: 'bg-slate-100 text-slate-600 border-slate-200',
          badgeText: 'Čeká'
        };
    }
  };

  const style = getStatusStyle();

  return (
    <div 
      onClick={onToggle}
      className={`p-4 rounded-xl border transition cursor-pointer select-none text-left group hover:shadow-xs ${style.border}`}
    >
      <div className="flex items-start gap-3">
        {/* Check Indicator */}
        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold transition group-hover:scale-105 ${style.indicator}`}>
          {step.status === 'completed' && '✓'}
          {step.status === 'current' && '●'}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              {step.czechLabel}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${style.badge}`}>
              {style.badgeText}
            </span>
          </div>

          <h4 className="font-display font-bold text-slate-800 text-sm leading-snug group-hover:text-teal-900 transition">
            {step.title}
          </h4>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>
    </div>
  );
}
