const express = require('express');
const router = express.Router();
const { deleteMedia,getMedia } = require('../controllers/mediaController');
const upload = require('../models/middleware/upload');
const { protect } = require('../models/middleware/authMiddleware');

router.delete("/:id", protect, deleteMedia);
router.get('/allmedia',protect ,getMedia);
module.exports = router;
