const mongoose = require('mongoose');

const manifestoSchema = new mongoose.Schema({
  party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party', required: true },
  election: { type: String, required: true }, 
  year: { type: Number, required: true },
  electionType: {
    type: String,
    enum: ['Lok Sabha', 'Rajya Sabha', 'State Assembly', 'Local Body'],
    default: 'Lok Sabha'
  },
  rawText: { type: String }, // full extracted text
  summary: { type: String }, // AI-generated summary
  categories: [{ type: String }], 
  chunks: [{
    text: { type: String },
    embedding: [{ type: Number }],
    category: { type: String },
    chunkIndex: { type: Number }
  }],
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'indexed', 'failed'],
    default: 'uploaded'
  },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Manifesto', manifestoSchema);
