import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined in the workspace secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Robust generation helper with automatic fallback models to prevent 503 high-demand errors
async function generateContentWithFallback(ai: GoogleGenAI, options: {
  contents: any;
  config: any;
  models?: string[];
}) {
  const models = options.models || ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
  let lastError: any = null;

  for (const model of models) {
    try {
      console.log(`Zkouším volat Gemini model: ${model}`);
      const response = await ai.models.generateContent({
        model: model,
        contents: options.contents,
        config: options.config,
      });
      return response;
    } catch (error: any) {
      console.warn(`Dočasná chyba u modelu ${model}:`, error.message || error);
      lastError = error;
    }
  }

  throw lastError || new Error("Žádný z dostupných Gemini modelů neodpověděl.");
}

// System Instruction for the AI Mentor
const MENTOR_SYSTEM_INSTRUCTION = `
Jsi osobní IT mentor, kariérní poradce, motivační kouč a nejlepší kamarád pro Tomáše (46 let, z Bohumína, Moravskoslezský kraj).
Tvým úkolem je pomoci mu úspěšně změnit kariéru a přejít do IT sektoru jako Junior Developer nebo "Vibecoder" (vývojář efektivně využívající AI nástroje jako Cursor, Copilot a LLM).

MÁŠ TYTO KLÍČOVÉ VLASTNOSTI A PRAVIDLA:
1. TONALITA A STYL:
   - Komunikuj výhradně v ČEŠTINĚ.
   - Používej neformální tón a TYKÁNÍ (jsi jeho "parťák/kámoš", co mu kryje záda).
   - Buď extrémně povzbudivý, empatický, praktický a orientovaný na řešení.
   - Vyhýbej se obřím blokům textu. Používej odrážky, tučné písmo pro zvýraznění a krátké odstavce.
   - Vždy zakonči svou odpověď jednou jasnou otázkou nebo dalším krokem, aby se konverzace posouvala dál.

2. SPECIÁLNÍ BRANÍK PRO KÓDOVÁNÍ (SOKRATOVSKÁ METODA):
   - NIKDY Tomášovi nepiš kompletní hotový kód jako první!
   - Místo toho vysvětluj koncepty jednoduše (např. analogie z běžného života).
   - Pokládej mu návodné otázky, požádej ho o napsání pseudokódu nebo aby ti vlastními slovy vysvětlil jednotlivé řádky kódu.
   - AI nástroje (Cursor, Copilot) představuj jako urychlovače produktivity, ne jako náhradu za pochopení základů. Tomáš musí kód psát sám, aby se ho naučil.

3. PRŮVODCE BYROKRACIÍ (ÚŘAD PRÁCE):
   - Pomáhej mu s přípravou na Úřad práce v Bohumíně pro schválení rekvalifikace (IT kurzy).
   - NIKDY si nevymýšlej interní směrnice, schválené rozpočty ani garantované "triky" na schválení. Jasně uveď, že pravidla Úřadu práce se mění.
   - Odkazuj ho na oficiální portál MPSV "Jsem v kurzu" a formulář "Zájemce o zvolenou rekvalifikaci".
   - Pomoz mu zformulovat argumenty pro úředníky (např. jak IT rekvalifikace zvýší jeho zaměstnatelnost v ostravském regionu).
   - Vždy mu připomeň, ať si aktuální požadavky ověří přímo na pobočce v Bohumíně.

4. REGIONÁLNÍ INTEGRACE (OSTRAVSKO):
   - Zaměř se na Moravskoslezský kraj (Ostrava, Bohumín, Karviná).
   - Pokud se tě zeptá na práci, nevymýšlej si fiktivní inzeráty. Pokud nemáš přístup k aktuálnímu webu, řekni mu, ať do chatu zkopíruje reálný inzerát z Jobs.cz, Prace.cz nebo StartupJobs.cz, a ty ho s ním rozebereš.
   - Společně analyzujte požadovaný technologický stack a přizpůsobte tomu jeho portfolio a plán.

5. MOTIVAČNÍ KOUČINK:
   - Bojuj s jeho obavami ohledně věku (46 let). Prezentuj jeho věk a životní zkušenosti jako obrovskou výhodu (spolehlivost, komunikační dovednosti, soft-skills, řešení konfliktů).
   - Pokud Tomáš vyjádří hlubokou psychologickou krizi nebo úzkosti, udržuj přátelskou hranici kariérního kouče a jemně ho nasměruj na odbornou pomoc. Ty řešíš kariéru, návyky a programování.
`;

// Endpoint for mentoring chat
app.post("/api/mentor/chat", async (req, res) => {
  try {
    const { messages, userProfile } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Zprávy chybí nebo nejsou ve správném formátu." });
    }

    const ai = getGeminiClient();

    // Map history to Gemini API structure
    const contents = messages.map((msg: any) => {
      return {
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      };
    });

    // Append profile context if available to keep the model updated about Tomáš's status
    let contextStr = "";
    if (userProfile) {
      contextStr = `\n[Aktuální stav Tomáše: IT znalosti: ${userProfile.itLiteracy || "Zatím nezadáno"}, Preferovaná oblast: ${userProfile.preferredArea || "Zatím nezadáno"}, Stav na Úřadu Práce: ${userProfile.laborOfficeStatus || "Zatím nezadáno"}, Pocity/Naladění: ${userProfile.mindsetFeelings || "Zatím nezadáno"}]`;
    }

    const systemInstruction = MENTOR_SYSTEM_INSTRUCTION + contextStr;

    const response = await generateContentWithFallback(ai, {
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ content: response.text });
  } catch (error: any) {
    console.error("Error in /api/mentor/chat:", error);
    res.status(500).json({ 
      error: "Nepodařilo se komunikovat s tvým mentorem. Zkontroluj, zda je nastaven GEMINI_API_KEY v nastavení.",
      details: error.message 
    });
  }
});

// Endpoint to analyze job description
app.post("/api/mentor/analyze-job", async (req, res) => {
  try {
    const { jobText } = req.body;
    if (!jobText || typeof jobText !== "string") {
      return res.status(400).json({ error: "Text inzerátu chybí." });
    }

    const ai = getGeminiClient();

    const response = await generateContentWithFallback(ai, {
      contents: `Analyzuj následující pracovní inzerát pro Tomáše (junior začátečník, 46 let, Moravskoslezský kraj) a poskytni strukturovanou analýzu:
      
      ${jobText}`,
      config: {
        systemInstruction: "Jsi zkušený IT recruiter pro Moravskoslezský kraj. Tvým úkolem je rozebrat inzerát, identifikovat klíčový technologický stack, zhodnotit šance v regionu a doporučit 2-3 konkrétní jednoduché projekty pro portfolio, které Tomášovi pomohou na tuto pozici aspirovat.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "company", "location", "techStack", "localDemandCzech", "recommendations", "suggestedProjects"],
          properties: {
            title: { type: Type.STRING, description: "Název pozice" },
            company: { type: Type.STRING, description: "Název firmy" },
            location: { type: Type.STRING, description: "Lokalita pozice" },
            techStack: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Seznam klíčových technologií z inzerátu"
            },
            localDemandCzech: { 
              type: Type.STRING, 
              description: "Zhodnocení poptávky po tomto stacku v Moravskoslezském kraji a dopad na juniora jako Tomáš" 
            },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3-4 konkrétní rady, na co se v učení zaměřit pro splnění požadavků"
            },
            suggestedProjects: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "2-3 nápady na projekty do portfolia šité na míru této pozici"
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error in /api/mentor/analyze-job:", error);
    res.status(500).json({ 
      error: "Nepodařilo se analyzovat inzerát. Zkontroluj, zda je nastaven GEMINI_API_KEY v nastavení.",
      details: error.message 
    });
  }
});

// Serve static assets and Vite development setup
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT} in ${isProd ? "production" : "development"} mode.`);
  });
}

startServer();
