const PromiseModel = require('../models/Promise');
const Party = require('../models/Party');

// GET /api/promises
const getPromises = async (req, res) => {
  const { party, category, status, election, year, search, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (party) filter.party = party;
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (election) filter.election = election;
  if (year) filter.year = parseInt(year);
  if (search) filter.$or = [
    { title: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } }
  ];

  const total = await PromiseModel.countDocuments(filter);
  const promises = await PromiseModel.find(filter)
    .populate('party', 'name abbreviation color logo')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json({ promises, total, page: parseInt(page), pages: Math.ceil(total / limit) });
};

// GET /api/promises/:id
const getPromiseById = async (req, res) => {
  const promise = await PromiseModel.findById(req.params.id)
    .populate('party', 'name abbreviation color logo');
  if (!promise) return res.status(404).json({ message: 'Promise not found' });
  res.json(promise);
};

// POST /api/promises  (admin/analyst)
const createPromise = async (req, res) => {
  const promise = await PromiseModel.create(req.body);
  // Update party stats
  await updatePartyStats(promise.party);
  res.status(201).json(promise);
};

// PUT /api/promises/:id  (admin/analyst)
const updatePromise = async (req, res) => {
  const promise = await PromiseModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!promise) return res.status(404).json({ message: 'Promise not found' });
  await updatePartyStats(promise.party);
  res.json(promise);
};

// DELETE /api/promises/:id  (admin)
const deletePromise = async (req, res) => {
  const promise = await PromiseModel.findByIdAndDelete(req.params.id);
  if (promise) await updatePartyStats(promise.party);
  res.json({ message: 'Promise deleted' });
};

// POST /api/promises/:id/vote
const votePromise = async (req, res) => {
  const { type } = req.body; // 'up' or 'down'
  const promise = await PromiseModel.findById(req.params.id);
  if (!promise) return res.status(404).json({ message: 'Promise not found' });

  const userId = req.user._id.toString();
  if (promise.voters.map(v => v.toString()).includes(userId))
    return res.status(400).json({ message: 'Already voted' });

  if (type === 'up') promise.upvotes++;
  else promise.downvotes++;
  promise.voters.push(req.user._id);

  // Auto-calculate status based on community votes
  const totalVotes = promise.upvotes + promise.downvotes;
  if (totalVotes > 0) {
    const fulfilledRatio = promise.upvotes / totalVotes;
    let newStatus = 'Pending';
    
    if (fulfilledRatio > 0.66) {
      newStatus = 'Fulfilled';
    } else if (fulfilledRatio > 0.50) {
      newStatus = 'Partially Fulfilled';
    }

    // Time-based penalty: if still pending after 5 years, it is broken
    if (newStatus === 'Pending') {
      const currentYear = new Date().getFullYear();
      if (currentYear - promise.year >= 5) {
        newStatus = 'Broken';
      }
    }

    promise.status = newStatus;
  }

  await promise.save();
  await updatePartyStats(promise.party);

  res.json({ upvotes: promise.upvotes, downvotes: promise.downvotes, status: promise.status });
};

// GET /api/promises/stats/overview
const getOverviewStats = async (req, res) => {
  const total = await PromiseModel.countDocuments();
  const byStatus = await PromiseModel.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  const byCategory = await PromiseModel.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);
  const byParty = await PromiseModel.aggregate([
    { $group: { _id: '$party', count: { $sum: 1 }, fulfilled: { $sum: { $cond: [{ $eq: ['$status', 'Fulfilled'] }, 1, 0] } } } },
    { $lookup: { from: 'parties', localField: '_id', foreignField: '_id', as: 'party' } },
    { $unwind: '$party' }
  ]);

  res.json({ total, byStatus, byCategory, byParty });
};

// Helper: recalculate party promise stats
async function updatePartyStats(partyId) {
  const promises = await PromiseModel.find({ party: partyId });
  await Party.findByIdAndUpdate(partyId, {
    totalPromises: promises.length,
    fulfilledPromises: promises.filter(p => p.status === 'Fulfilled').length,
    partialPromises: promises.filter(p => p.status === 'Partially Fulfilled').length,
    pendingPromises: promises.filter(p => p.status === 'Pending').length,
  });
}

module.exports = { getPromises, getPromiseById, createPromise, updatePromise, deletePromise, votePromise, getOverviewStats };
