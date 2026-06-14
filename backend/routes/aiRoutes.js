const express = require('express');
const router = express.Router();
const { chat, askManifesto, extractPromises, analyzePromise, compareManifestos } = require('../controllers/aiController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/chat', chat); 
router.post('/ask-manifesto', askManifesto);
router.post('/extract-promises', protect, adminOnly, extractPromises);
router.post('/analyze-promise', protect, analyzePromise);
router.post('/compare-manifestos', compareManifestos); 

module.exports = router;
