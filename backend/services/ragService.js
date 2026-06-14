/**
 * RAG Service - TF-IDF based similarity search
 */

// Force word-based chunking — reliable on all text formats
const chunkText = (text, chunkSize = 100, overlap = 20) => {
  const words = text.split(/\s+/).filter(w => w.trim().length > 0);
  const chunks = [];

  for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
    const chunkWords = words.slice(i, i + chunkSize);
    const chunkText = chunkWords.join(' ').trim();
    if (chunkText.length > 80) {
      chunks.push({
        text: chunkText,
        chunkIndex: chunks.length,
        category: detectCategory(chunkText)
      });
    }
  }

  return chunks;
};

const detectCategory = (text) => {
  const lower = text.toLowerCase();
  const map = {
    'Agriculture': ['farmer', 'kisan', 'crop', 'agriculture', 'irrigation', 'msp', 'fertilizer', 'farm', 'paddy', 'wheat', 'sugarcane', 'agricultural'],
    'Economy': ['gdp', 'economy', 'growth', 'inflation', 'budget', 'fiscal', 'trade', 'investment', 'manufacturing', 'economic', 'industry'],
    'Defence': ['defence', 'defense', 'military', 'army', 'security', 'border', 'armed'],
    'Education': ['education', 'school', 'university', 'student', 'scholarship', 'teacher', 'college', 'iit', 'iim', 'literacy', 'skill'],
    'Health': ['health', 'hospital', 'medical', 'doctor', 'ayushman', 'medicine', 'clinic', 'healthcare', 'aiims', 'dialysis'],
    'Infrastructure': ['road', 'highway', 'railway', 'airport', 'metro', 'expressway', 'bridge', 'infrastructure'],
    'Employment': ['job', 'employment', 'youth', 'startup', 'rozgar', 'unemploy', 'recruit', 'vacancy', 'work'],
    'Environment': ['environment', 'climate', 'forest', 'pollution', 'renewable', 'solar', 'clean', 'green', 'tree'],
    'Social Welfare': ['welfare', 'pension', 'subsidy', 'bpl', 'ration', 'housing', 'awas', 'poor', 'women', 'ujjwala'],
    'Governance': ['governance', 'corruption', 'transparency', 'digital', 'police', 'law', 'court', 'order'],
    'Technology': ['technology', 'digital', 'internet', '5g', 'broadband', 'cyber', 'artificial intelligence', 'ai'],
    'Taxation': ['tax', 'gst', 'income tax', 'revenue', 'duty'],
  };
  for (const [cat, kws] of Object.entries(map)) {
    if (kws.some(kw => lower.includes(kw))) return cat;
  }
  return 'Other';
};

const createTFIDFVector = (text, vocabulary) => {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  const freq = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  return vocabulary.map(term => (freq[term] || 0) / Math.max(words.length, 1));
};

const buildVocabulary = (chunks, maxTerms = 500) => {
  const stopWords = new Set(['the', 'and', 'for', 'that', 'this', 'with', 'have', 'will', 'from', 'they', 'been', 'were', 'also', 'more', 'their', 'which', 'all', 'per', 'under', 'new', 'every', 'each', 'into', 'over', 'such', 'about']);
  const freq = {};
  chunks.forEach(chunk => {
    const words = chunk.text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !stopWords.has(w));
    [...new Set(words)].forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  });
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, maxTerms).map(([w]) => w);
};

const cosineSimilarity = (a, b) => {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] ** 2; nb += b[i] ** 2; }
  return (na === 0 || nb === 0) ? 0 : dot / (Math.sqrt(na) * Math.sqrt(nb));
};

const keywordScore = (query, text) => {
  const qWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const t = text.toLowerCase();
  return qWords.reduce((s, w) => s + (t.includes(w) ? 1 : 0), 0) / Math.max(qWords.length, 1);
};

const embedChunks = async (chunks) => {
  if (!chunks.length) return [];
  const vocabulary = buildVocabulary(chunks);
  return chunks.map(chunk => ({ ...chunk, embedding: createTFIDFVector(chunk.text, vocabulary), vocabulary }));
};

const retrieveRelevantChunks = (query, chunks, topK = 5) => {
  if (!chunks || chunks.length === 0) return [];
  const vocabulary = chunks[0]?.vocabulary || buildVocabulary(chunks);
  const qVec = createTFIDFVector(query, vocabulary);
  return chunks
    .map(c => ({ ...c, score: cosineSimilarity(qVec, c.embedding || []) * 0.5 + keywordScore(query, c.text) * 0.5 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
};

module.exports = { chunkText, embedChunks, retrieveRelevantChunks, detectCategory };