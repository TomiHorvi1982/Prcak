import React, { useState } from 'react';
import { Landmark, ArrowRight, ClipboardCopy, CheckCircle2, AlertTriangle, ExternalLink, Sparkles } from 'lucide-react';

export default function UradPraceGuide() {
  const [previousJob, setPreviousJob] = useState('');
  const [softSkill, setSoftSkill] = useState('');
  const [generatedArgs, setGeneratedArgs] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateArguments = () => {
    let jobContext = "předchozích pracovních zkušeností";
    if (previousJob === 'manual') jobContext = "manuální práce, kde je klíčová preciznost, pracovitost a okamžité řešení problémů";
    else if (previousJob === 'trade') jobContext = "obchodu a služeb, kde jsem denně jednal se zákazníky, řešil jejich potřeby a organizoval si čas";
    else if (previousJob === 'logistics') jobContext = "logistiky a dopravy, kde rozhoduje spolehlivost, plánování a zvládání stresu";
    else if (previousJob === 'admin') jobContext = "administrativy, kde jsem zvyklý na pečlivost, práci s daty a organizaci";

    let softContext = "odpovědnost a stabilita";
    if (softSkill === 'reliability') softContext = "extrémní spolehlivost, loajalita a vysoké pracovní nasazení. Oproti mladším absolventům mohu nabídnout vyzrálost a schopnost dotahovat úkoly do konce";
    else if (softSkill === 'communication') softContext = "skvělé komunikační dovednosti, schopnost týmové spolupráce a konstruktivní řešení konfliktů";
    else if (softSkill === 'logic') softContext = "analytické myšlení, smysl pro detail a schopnost systematicky přistupovat k novým výzvám";

    const text = `Vzhledem ke své snaze o plnou integraci na trhu práce v Moravskoslezském kraji žádám o schválení zvolené rekvalifikace v oblasti informačních technologií. 

Jako občan z Bohumína s bohatými životními zkušenostmi vnímám IT sektor v našem regionu (Ostrava a okolí) jako klíčový pro svou další pracovní kariéru. Tento obor vykazuje dlouhodobý nedostatek kvalifikovaných pracovníků a digitální dovednosti jsou nezbytným předpokladem stabilního uplatnění.

Můj věk (46 let) přináší zaměstnavatelům obrovskou výhodu v podobě mé loajality, životní vyzrálosti a zodpovědného přístupu k práci. Na rozdíl od čerstvých absolventů nabízím prověřené měkké dovednosti, zejména pak ${softContext}. Moje předchozí profesní dráha v oblasti ${jobContext} mě naučila pracovitosti, přizpůsobivosti a schopnosti rychle se učit nové postupy.

Schválení této rekvalifikace mi umožní osvojit si moderní programovací dovednosti a efektivní práci s AI asistenty (tzv. vibecoding), čímž se stanu vysoce konkurenceschopným uchazečem. Jsem plně odhodlán úspěšně absolvovat celý kurz a okamžitě nastoupit do zaměstnání u některé z IT firem v našem regionu, se kterými již nyní mapuji možnosti spolupráce.`;

    setGeneratedArgs(text);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedArgs);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-8" id="urad-prace-panel">
      {/* Overview Card */}
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col md:flex-row gap-6 items-start">
        <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <Landmark className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-display font-bold text-lg text-slate-800">Průvodce byrokracií: Úřad práce v Bohumíně</h2>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            Stát nabízí možnost financování IT kurzů (rekvalifikace) až do výše 50 000 Kč prostřednictvím portálu 
            <strong> "Jsem v kurzu"</strong>. Jako zájemce z Bohumína spadáte pod pobočku na Studentské ulici.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <a 
              href="https://www.uradprace.cz/web/cz/karvina#bohumin" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 transition"
            >
              Oficiální kontakt pobočky Bohumín <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://www.mpsv.cz/web/cz/jsem-v-kurzu" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 transition"
            >
              Portál "Jsem v kurzu" (MPSV) <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Steps checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-2xs">
          <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">1</span>
            Jak požádat o kurz (rekvalifikaci)
          </h3>
          <ul className="space-y-3.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Zaregistruj se na Úřadu práce v Bohumíně jako <strong>"Zájemce o zaměstnání"</strong> (můžeš i při stávajícím zaměstnání).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Vyber si kurz na e-shopu MPSV <strong>"Jsem v kurzu"</strong>. Hledej kurzy zaměřené na tvorbu webů, Python nebo datovou analýzu.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Přihlas se na vybraný kurz přímo přes portál (přihlášením např. bankovní identitou).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Vyplň odůvodnění v žádosti (využij náš interaktivní generátor níže). Žádost musí být podána alespoň <strong>30 dní před zahájením</strong> kurzu!</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-2xs">
          <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Důležitá upozornění a mýty
          </h3>
          <div className="space-y-4 text-xs text-slate-600">
            <div>
              <h4 className="font-semibold text-slate-800">⚠️ Žádný trik nezaručí 100% schválení</h4>
              <p className="mt-1">Pravidla a rozpočty poboček se často mění. Klíčem ke schválení je ukázat úředníkovi, že s novou dovedností máte obrovskou šanci najít si práci v Moravskoslezském kraji.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">⚠️ Podpora 50 000 Kč na 3 roky</h4>
              <p className="mt-1">Tato částka je maximální strop, který za vás Úřad práce zaplatí. Pokud kurz stojí méně, zbytek můžete využít na další kurzy později.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Argument Builder */}
      <div className="bg-white border border-slate-150 rounded-xl p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-teal-600" />
          <h3 className="font-display font-bold text-slate-800 text-base">Generátor odůvodnění žádosti (Zájemce o rekvalifikaci)</h3>
        </div>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Zvol své předchozí zkušenosti a nejsilnější vlastnosti. Vygeneruji ti profesionálně formulované 
          odůvodnění v češtině, které můžeš vložit do přílohy formuláře MPSV nebo osobně předložit na pobočce v Bohumíně.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Left selector: previous jobs */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Moje předchozí profese / zkušenosti:</label>
            <select 
              value={previousJob}
              onChange={(e) => setPreviousJob(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 text-slate-800 rounded-lg p-2.5 text-xs outline-hidden transition"
            >
              <option value="">-- Vyber nejbližší oblast --</option>
              <option value="manual">Manuální práce / Výroba / Řemeslo</option>
              <option value="trade">Obchod / Prodej / Služby</option>
              <option value="logistics">Sklady / Logistika / Doprava</option>
              <option value="admin">Administrativa / Kancelář</option>
              <option value="other">Jiná profese</option>
            </select>
          </div>

          {/* Right selector: soft skills */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Moje nejsilnější měkká dovednost (Soft skill):</label>
            <select 
              value={softSkill}
              onChange={(e) => setSoftSkill(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 text-slate-800 rounded-lg p-2.5 text-xs outline-hidden transition"
            >
              <option value="">-- Vyber svou silnou stránku --</option>
              <option value="reliability">Spolehlivost, loajalita a dotahování úkolů</option>
              <option value="communication">Komunikace, řešení problémů a práce v týmu</option>
              <option value="logic">Analytické myšlení, smysl pro detail a učení se</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleGenerateArguments}
          disabled={!previousJob || !softSkill}
          className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-medium text-xs px-4 py-2.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-sm disabled:shadow-none mb-6"
        >
          <span>Vygenerovat odůvodnění</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Arguments Output */}
        {generatedArgs && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                Návrh odůvodnění pro tvoji žádost:
              </span>
              <button
                onClick={handleCopy}
                className="text-slate-500 hover:text-teal-600 font-bold text-xs flex items-center gap-1 transition cursor-pointer bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs"
              >
                <ClipboardCopy className="w-3.5 h-3.5" />
                {copied ? 'Zkopírováno! ✅' : 'Zkopírovat text'}
              </button>
            </div>
            <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed border-t border-slate-100 pt-3">
              {generatedArgs}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
