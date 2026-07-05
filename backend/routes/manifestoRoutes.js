const express = require('express');
const router = express.Router();
const { getManifestos, getManifestoById, uploadManifestoPDF, addManifestoText } = require('../controllers/manifestoController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getManifestos);
router.get('/:id', getManifestoById);
router.post('/upload', protect, adminOnly, upload.single('pdf'), uploadManifestoPDF);
router.post('/text', protect, adminOnly, addManifestoText);

module.exports = router;
