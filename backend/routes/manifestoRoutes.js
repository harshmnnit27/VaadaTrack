const express = require('express');
const router = express.Router();
const { getManifestos, getManifestoById, uploadManifesto, addManifestoText, upload } = require('../controllers/manifestoController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getManifestos);
router.get('/:id', getManifestoById);
router.post('/upload', protect, adminOnly, upload.single('pdf'), uploadManifesto);
router.post('/text', protect, adminOnly, addManifestoText);

module.exports = router;
