/**
 * Re-index all manifestos with better chunking
 * Run: node utils/reindexManifestos.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
require('../models/Party'); // register schema
const Manifesto = require('../models/Manifesto');
const ragService = require('../services/ragService');

const Party = require('../models/Party');
const PromiseModel = require('../models/Promise');


async function reindex() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const manifestos = await Manifesto.find({ status: 'indexed', rawText: { $exists: true, $ne: '' } });
  console.log(`Found ${manifestos.length} manifestos to re-index`);

  for (const m of manifestos) {
    if (!m.rawText || m.rawText.length < 100) {
      console.log(`⏭️  Skipping ${m.election} — no raw text`);
      continue;
    }

    const chunks = ragService.chunkText(m.rawText);
    const embeddedChunks = await ragService.embedChunks(chunks);

    await Manifesto.findByIdAndUpdate(m._id, {
      chunks: embeddedChunks,
      status: 'indexed'
    });

    console.log(`✅ Re-indexed: ${m.election} — ${chunks.length} chunks`);
  }

  console.log('\n🎉 Re-indexing complete!');
  mongoose.disconnect();
}

reindex().catch(e => { console.error('❌', e.message); mongoose.disconnect(); });
