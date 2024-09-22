const express = require('express');
const router = express.Router();
const store = require('../data/store');

router.get('/', (req, res) => {
  const { startDate, endDate, type } = req.query;
  const statistics = store.getStatistics(startDate, endDate, type);
  res.json(statistics);
});

module.exports = router;