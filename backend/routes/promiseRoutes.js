const express = require('express');
const router = express.Router();
const { getPromises, getPromiseById, createPromise, updatePromise, deletePromise, votePromise, getOverviewStats } = require('../controllers/promiseController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getPromises);
router.get('/stats/overview', getOverviewStats);
router.get('/:id', getPromiseById);
router.post('/', protect, createPromise);
router.put('/:id', protect, updatePromise);
router.delete('/:id', protect, adminOnly, deletePromise);
router.post('/:id/vote', protect, votePromise);

module.exports = router;
