const Party = require('../models/Party');
const Promise = require('../models/Promise');

// GET /api/parties
const getParties = async (req, res) => {
  const { state } = req.query;
  const filter = state ? { state } : {};
  const parties = await Party.find(filter).sort({ name: 1 });
  res.json(parties);
};

// GET /api/parties/:id
const getPartyById = async (req, res) => {
  const party = await Party.findById(req.params.id);
  if (!party) return res.status(404).json({ message: 'Party not found' });

  // Get promise stats
  const promises = await Promise.find({ party: party._id });
  const stats = {
    total: promises.length,
    fulfilled: promises.filter(p => p.status === 'Fulfilled').length,
    partial: promises.filter(p => p.status === 'Partially Fulfilled').length,
    broken: promises.filter(p => p.status === 'Broken').length,
    inProgress: promises.filter(p => p.status === 'In Progress').length,
    pending: promises.filter(p => p.status === 'Pending').length,
  };

  // Category breakdown
  const categoryMap = {};
  promises.forEach(p => {
    if (!categoryMap[p.category]) categoryMap[p.category] = 0;
    categoryMap[p.category]++;
  });

  res.json({ ...party.toJSON(), stats, categoryBreakdown: categoryMap });
};

// POST /api/parties  (admin only)
const createParty = async (req, res) => {
  const party = await Party.create(req.body);
  res.status(201).json(party);
};

// PUT /api/parties/:id  (admin only)
const updateParty = async (req, res) => {
  const party = await Party.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!party) return res.status(404).json({ message: 'Party not found' });
  res.json(party);
};

// DELETE /api/parties/:id  (admin only)
const deleteParty = async (req, res) => {
  await Party.findByIdAndDelete(req.params.id);
  res.json({ message: 'Party deleted' });
};

// GET /api/parties/compare?ids=id1,id2
const compareParties = async (req, res) => {
  const ids = req.query.ids?.split(',') || [];
  if (ids.length < 2) return res.status(400).json({ message: 'At least 2 party IDs required' });

  const results = await Promise.all(ids.map(async (id) => {
    const party = await Party.findById(id);
    if (!party) return null;
    const promises = await Promise.find({ party: id });
    return {
      party,
      stats: {
        total: promises.length,
        fulfilled: promises.filter(p => p.status === 'Fulfilled').length,
        partial: promises.filter(p => p.status === 'Partially Fulfilled').length,
        broken: promises.filter(p => p.status === 'Broken').length,
      }
    };
  }));

  res.json(results.filter(Boolean));
};

module.exports = { getParties, getPartyById, createParty, updateParty, deleteParty, compareParties };
