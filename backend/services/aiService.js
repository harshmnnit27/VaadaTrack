const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Summarize manifesto
const summarizeManifesto = async (text) => {
  const truncated = text.slice(0, 15000);

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `
You are a political analyst.

Summarize the following election manifesto in 3-5 paragraphs.
Focus on key promises, themes, and target demographics.
Be factual and neutral.

Manifesto:
${truncated}
`,
      },
    ],
  });

  return completion.choices[0].message.content;
};

// Extract categories
const extractCategories = async (text) => {
  const truncated = text.slice(0, 10000);

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `
Extract the main policy categories covered in this manifesto.

Return ONLY a JSON array from:
["Agriculture","Economy","Defence","Education","Health","Infrastructure","Employment","Environment","Social Welfare","Taxation","Foreign Policy","Governance","Technology"]

Manifesto:
${truncated}
`,
      },
    ],
  });

  try {
    const response = completion.choices[0].message.content;

    const clean = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(clean);
  } catch {
    return ["Other"];
  }
};

// Extract promises
const extractPromises = async (text, category = null) => {
  const truncated = text.slice(0, 12000);

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `
You are a political fact checker.

Extract 10-20 specific promises.

${category ? `Focus only on ${category}` : ""}

Return ONLY JSON:

[
 {
   "title":"...",
   "description":"...",
   "category":"..."
 }
]

Manifesto:
${truncated}
`,
      },
    ],
  });

  try {
    const response = completion.choices[0].message.content;

    const clean = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(clean);
  } catch (error) {
    console.error("Extract Promises Error:", error);
    return [];
  }
};

// Analyze promise fulfillment
const analyzePromiseFulfillment = async (promise, evidenceTexts) => {
  const evidenceSummary = evidenceTexts.join("\n").slice(0, 8000);

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `
Analyze whether this promise has been fulfilled.

PROMISE:
${promise.title}

DESCRIPTION:
${promise.description}

EVIDENCE:
${evidenceSummary}

Return ONLY JSON:

{
  "status":"Fulfilled",
  "analysis":"...",
  "score":85
}
`,
      },
    ],
  });

  try {
    const response = completion.choices[0].message.content;

    const clean = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(clean);
  } catch (error) {
    console.error("Analyze Promise Error:", error);

    return {
      status: "Unverifiable",
      analysis: "Could not analyze",
      score: 0,
    };
  }
};

const answerFromContext = async (
  query,
  contextChunks,
  partyName,
  election
) => {
  const context = contextChunks
    .map((c) => c.text)
    .join("\n\n")
    .slice(0, 15000);

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `
You are an expert analyst of Indian election manifestos.

Rules:
- Use the manifesto context provided.
- If the answer is partially available, provide the available information.
- Summarize related promises clearly.
- Do not simply say information is unavailable unless no relevant content exists at all.
- Use bullet points when appropriate.
`,
      },
      {
        role: "user",
        content: `
Party: ${partyName}
Election: ${election}

Question:
${query}

Manifesto Context:
${context}
`,
      },
    ],
  });

  return completion.choices[0].message.content;
};

// General chat
const chatWithAI = async (messages) => {
  const prompt = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `
You are VaadaBot.

You specialize in:
- Indian politics
- Election manifestos
- Party comparisons
- Promise tracking

Be neutral and factual.
`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return completion.choices[0].message.content;
};

module.exports = {
  summarizeManifesto,
  extractCategories,
  extractPromises,
  analyzePromiseFulfillment,
  answerFromContext,
  chatWithAI,
};