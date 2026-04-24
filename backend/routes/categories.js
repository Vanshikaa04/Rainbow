const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    { id: 'clove',    name: 'Clove',     icon: '🌿', description: 'Premium clove products',  color: '#8B4513' },
    { id: 'i-fresh',  name: 'I-Fresh',   icon: '❄️', description: 'Fresh & natural range',   color: '#00897B' },
    { id: 'cutebaby', name: 'CuteBaby',  icon: '🍼', description: 'Baby care essentials',    color: '#EC407A' },
    { id: 'general',  name: 'General',   icon: '🛍️', description: 'Everyday essentials',     color: '#5C6BC0' },
  ]);
});

module.exports = router;