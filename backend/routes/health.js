const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: "Backend is running!" });
});

module.exports = router; 