const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  abbreviation: { type: String, required: true }, 
  founded: { type: Number },
  ideology: { type: String },
  logo: { type: String }, 
  color: { type: String, default: '#3B82F6' }, 
  description: { type: String },
  website: { type: String },
  state: { type: String, default: 'National' }, 
  totalPromises: { type: Number, default: 0 },
  fulfilledPromises: { type: Number, default: 0 },
  partialPromises: { type: Number, default: 0 },
  pendingPromises: { type: Number, default: 0 },
}, { timestamps: true });


partySchema.virtual('fulfillmentRate').get(function () {
  if (this.totalPromises === 0) return 0;
  return Math.round(((this.fulfilledPromises + this.partialPromises * 0.5) / this.totalPromises) * 100);
});

partySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Party', partySchema);
