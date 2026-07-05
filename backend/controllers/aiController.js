const aiService = require("../services/aiService");
const ragService = require("../services/ragService");
const Manifesto = require("../models/Manifesto");
const PromiseModel = require("../models/Promise");

// POST /api/ai/chat
const chat = async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({
      message: "messages array required",
    });
  }

  const response = await aiService.chatWithAI(messages);

  res.json({ response });
};

// POST /api/ai/ask-manifesto
const askManifesto = async (req, res) => {
  const { manifestoId, query } = req.body;

  if (!manifestoId || !query) {
    return res.status(400).json({
      message: "manifestoId and query required",
    });
  }

  const manifesto = await Manifesto.findById(manifestoId).populate(
    "party",
    "name"
  );

  if (!manifesto) {
    return res.status(404).json({
      message: "Manifesto not found",
    });
  }

  if (manifesto.status !== "indexed") {
    return res.status(400).json({
      message: "Manifesto not yet indexed. Try again later.",
    });
  }

  const relevantChunks = ragService.retrieveRelevantChunks(
    query,
    manifesto.chunks,
    5
  );

  const answer = await aiService.answerFromContext(
    query,
    relevantChunks,
    manifesto.party.name,
    manifesto.election
  );

  res.json({
    answer,
    sources: relevantChunks.map((c) => ({
  text: (c.text || "").slice(0, 200),
  category: c.category || "Other",
  score: c.score || 0,
}))
  });
};

// POST /api/ai/extract-promises
const extractPromises = async (req, res) => {
  const { manifestoId, category } = req.body;

  if (!manifestoId) {
    return res.status(400).json({
      message: "manifestoId required",
    });
  }

  const manifesto = await Manifesto.findById(manifestoId).populate(
    "party",
    "name abbreviation"
  );

  if (!manifesto) {
    return res.status(404).json({
      message: "Manifesto not found",
    });
  }

  const promises = await aiService.extractPromises(
    manifesto.rawText,
    category
  );

  const existingPromises = await PromiseModel.find({ manifesto: manifestoId });
  const existingChunks = existingPromises.map(p => ({
    text: `${p.title} ${p.description}`,
    promiseId: p._id,
    originalTitle: p.title
  }));
  
  const embeddedExisting = await ragService.embedChunks(existingChunks);

  const VALID_CATEGORIES = ['Agriculture', 'Economy', 'Defence', 'Education', 'Health',
    'Infrastructure', 'Employment', 'Environment', 'Social Welfare',
    'Taxation', 'Foreign Policy', 'Governance', 'Technology', 'Other'];

  const previewPromises = promises.map((p) => {
    let isDuplicate = false;
    let duplicateOf = null;

    if (embeddedExisting.length > 0) {
      const match = ragService.retrieveRelevantChunks(`${p.title} ${p.description}`, embeddedExisting, 1)[0];
      if (match && match.score > 0.6) {
        isDuplicate = true;
        duplicateOf = match.originalTitle;
      }
    }

    // Ensure category matches schema enum exactly
    let validCategory = "Other";
    if (p.category) {
      const matched = VALID_CATEGORIES.find(c => c.toLowerCase() === p.category.toLowerCase());
      if (matched) validCategory = matched;
    }

    return {
      party: manifesto.party._id,
      partyName: manifesto.party.name,
      partyAbbreviation: manifesto.party.abbreviation,
      manifesto: manifesto._id,
      election: manifesto.election,
      year: manifesto.year,
      title: p.title,
      description: p.description,
      category: validCategory,
      status: "Pending", // Fulfillment status
      isDuplicate,
      duplicateOf
    };
  });

  res.json({
    extracted: promises.length,
    promises: previewPromises,
  });
};

// POST /api/ai/analyze-promise
const analyzePromise = async (req, res) => {
  const { promiseId } = req.body;

  if (!promiseId) {
    return res.status(400).json({
      message: "promiseId required",
    });
  }

  const promise = await PromiseModel.findById(promiseId);

  if (!promise) {
    return res.status(404).json({
      message: "Promise not found",
    });
  }

  const evidenceTexts = promise.evidence.map(
    (e) => `${e.title}: ${e.description}`
  );

  const analysis = await aiService.analyzePromiseFulfillment(
    promise,
    evidenceTexts
  );

  promise.status = analysis.status;
  promise.verificationScore = analysis.score;
  promise.aiAnalysis = analysis.analysis;

  await promise.save();

  res.json(analysis);
};

// POST /api/ai/compare-manifestos
const compareManifestos = async (req, res) => {
  try {
    const { manifestoId1, manifestoId2, topic } = req.body;

    if (!manifestoId1 || !manifestoId2 || !topic) {
      return res.status(400).json({
        message: "Both manifesto IDs and topic required",
      });
    }

    const [m1, m2] = await Promise.all([
      Manifesto.findById(manifestoId1).populate("party", "name"),
      Manifesto.findById(manifestoId2).populate("party", "name"),
    ]);

    if (!m1 || !m2) {
      return res.status(404).json({
        message: "One or both manifestos not found",
      });
    }

    const chunks1 = ragService.retrieveRelevantChunks(
      topic,
      m1.chunks || [],
      3
    );

    const chunks2 = ragService.retrieveRelevantChunks(
      topic,
      m2.chunks || [],
      3
    );

    const context1 = chunks1.map((c) => c.text).join("\n");
    const context2 = chunks2.map((c) => c.text).join("\n");

    const comparison = await aiService.chatWithAI([
      {
        role: "user",
        content: `
Compare how ${m1.party.name} and ${m2.party.name}
address the topic "${topic}" based on their manifestos.

${m1.party.name} manifesto excerpt:
${context1 || "No relevant content found"}

${m2.party.name} manifesto excerpt:
${context2 || "No relevant content found"}

Provide:
1. Key similarities
2. Key differences
3. Which party places more emphasis on this topic

Be factual, neutral and concise.
`,
      },
    ]);

    res.json({ comparison });
  } catch (error) {
    console.error("Compare Manifestos Error:", error);

    res.status(500).json({
      message: "Failed to compare manifestos",
      error: error.message,
    });
  }
};

module.exports = {
  chat,
  askManifesto,
  extractPromises,
  analyzePromise,
  compareManifestos,
};