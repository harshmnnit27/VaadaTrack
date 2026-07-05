const Manifesto = require('../models/Manifesto');
const aiService = require('../services/aiService');
const ragService = require('../services/ragService');
const pdfParse = require('pdf-parse');

// GET /api/manifestos

// const getManifestos = async (req, res) => {
//   const { partyAbbr, year, election } = req.query;
//   const filter = {};
//   if (partyAbbr) filter.party = partyAbbr;
//   if (year) filter.year = parseInt(year);
//   if (election) filter.election = { $regex: election, $options: 'i' };

//   const manifestos = await Manifesto.find(filter)
//     .populate('party', 'name abbreviation color')
//     .select('-chunks -rawText') // don't return heavy fields in list
//     .sort({ year: -1 });
//     console.log('=== GET MANIFESTOS ===');
//     console.log('Filter:', filter);
//     console.log('Found manifestos:', manifestos.length);
//     console.log(manifestos)
//   res.json(manifestos);
// };

const getManifestos = async (req, res) => {
  const { party, year, election } = req.query;
  const filter = {};
  if (party) filter.party = party;
  if (year) filter.year = parseInt(year);
  if (election) filter.election = { $regex: election, $options: 'i' };

  const manifestos = await Manifesto.find(filter)
    .populate('party', 'name abbreviation color')
    .select('-chunks -rawText')
    .sort({ year: -1 });
    
  console.log('=== GET MANIFESTOS ===');
  console.log('Filter:', filter);
  console.log('Found manifestos:', manifestos.length);
  console.log('First manifesto party:', manifestos[0]?.party);
  console.log('First manifesto raw party ID:', manifestos[0]?.party?._id || manifestos[0]?.toObject().party);
  
  res.json(manifestos);
};



// GET /api/manifestos/:id
const getManifestoById = async (req, res) => {
  const manifesto = await Manifesto.findById(req.params.id)
    .populate('party', 'name abbreviation color')
    .select('-chunks'); // exclude embedding chunks
  if (!manifesto) return res.status(404).json({ message: 'Manifesto not found' });
  res.json(manifesto);
};

// POST /api/manifestos/upload  (admin only) - Upload PDF
const uploadManifestoPDF = async (req, res) => {
  const { partyId, election, year, electionType } = req.body;

  if (!req.file) return res.status(400).json({ message: 'PDF file required' });
  if (!partyId || !election || !year)
    return res.status(400).json({ message: 'partyId, election, year required' });

  // Parse PDF
  let rawText = '';
  try {
    const pdfData = await pdfParse(req.file.buffer);
    rawText = pdfData.text;
  } catch (e) {
    return res.status(400).json({ message: 'Failed to parse PDF: ' + e.message });
  }

  // Create manifesto record
  const manifesto = await Manifesto.create({
    party: partyId,
    election,
    year: parseInt(year),
    electionType,
    rawText,
    pdfName: req.file.originalname,
    pdfSize: req.file.size,
    status: 'processing',
    uploadedBy: req.user._id,
  });

  // Process in background: summarize + extract promises + embed
  processManifesto(manifesto._id, rawText).catch(console.error);

  res.status(201).json({ _id: manifesto._id, message: 'Manifesto uploaded, processing started', status: 'processing' });
};

// POST /api/manifestos/text  (admin only) - Add via raw text
const addManifestoText = async (req, res) => {
  const { partyId, election, year, electionType, text } = req.body;
  if (!partyId || !election || !year || !text)
    return res.status(400).json({ message: 'partyId, election, year, text required' });

  const manifesto = await Manifesto.create({
    party: partyId,
    election,
    year: parseInt(year),
    electionType,
    rawText: text,
    status: 'processing',
    uploadedBy: req.user._id,
  });

  processManifesto(manifesto._id, text).catch(console.error);
  res.status(201).json({ _id: manifesto._id, message: 'Processing started', status: 'processing' });
};

// Background job: summarize + chunk + embed manifesto
async function processManifesto(manifestoId, rawText) {
  try {
    // 1. Generate AI summary
    const summary = await aiService.summarizeManifesto(rawText);

    // 2. Extract categories
    const categories = await aiService.extractCategories(rawText);

    // 3. Chunk text and create embeddings for RAG
    const chunks = ragService.chunkText(rawText);
    const embeddedChunks = await ragService.embedChunks(chunks);

    await Manifesto.findByIdAndUpdate(manifestoId, {
      summary,
      categories,
      chunks: embeddedChunks,
      status: 'indexed',
    });

    console.log(`Manifesto ${manifestoId} processed successfully`);
  } catch (err) {
    console.error('processManifesto error:', err.message);
    await Manifesto.findByIdAndUpdate(manifestoId, { status: 'failed' });
  }
}

module.exports = { getManifestos, getManifestoById, uploadManifestoPDF, addManifestoText };
