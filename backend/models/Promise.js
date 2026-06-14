const mongoose = require('mongoose');

const promiseSchema = new mongoose.Schema({
  party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party', required: true },
  manifesto: { type: mongoose.Schema.Types.ObjectId, ref: 'Manifesto' },
  election: { type: String, required: true },
  year: { type: Number, required: true },

  title: { type: String, required: true }, 
  description: { type: String, required: true }, 
  category: {
    type: String,
    enum: ['Agriculture', 'Economy', 'Defence', 'Education', 'Health',
      'Infrastructure', 'Employment', 'Environment', 'Social Welfare',
      'Taxation', 'Foreign Policy', 'Governance', 'Technology', 'Other'],
    default: 'Other'
  },

  status: {
    type: String,
    enum: ['Fulfilled', 'Partially Fulfilled', 'Broken', 'In Progress', 'Pending', 'Unverifiable'],
    default: 'Pending'
  },

  verificationScore: { type: Number, min: 0, max: 100, default: 0 },
  

  evidence: [{
    title: { type: String },
    url: { type: String },
    description: { type: String },
    date: { type: Date },
    source: { type: String },
    type: { type: String, enum: ['news', 'government_order', 'report', 'other'], default: 'news' }
  }],

  aiAnalysis: { type: String }, 
  tags: [{ type: String }],

  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
 
  voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

}, { timestamps: true });

module.exports = mongoose.model('Promise', promiseSchema);
