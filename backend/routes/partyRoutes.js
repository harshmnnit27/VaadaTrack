const express = require('express');
const router = express.Router();
const { getParties, getPartyById, createParty, updateParty, deleteParty, compareParties } = require('../controllers/partyController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getParties);
router.get('/compare', compareParties);
router.get('/:id', getPartyById);
router.post('/', protect, adminOnly, createParty);
router.put('/:id', protect, adminOnly, updateParty);
router.delete('/:id', protect, adminOnly, deleteParty);

module.exports = router;
