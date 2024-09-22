const express = require('express');
const router = express.Router();
const store = require('../data/store');

router.get('/', (req, res) => {
  const cartItems = store.getAllCartItems();
  res.json(cartItems);
});

router.post('/', (req, res) => {
  const { materialId, quantity } = req.body;
  try {
    const newItem = store.addCartItem({ materialId, quantity });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  store.deleteCartItem(id);
  res.sendStatus(204);
});

router.post('/finalize', (req, res) => {
  try {
    const archive = store.finalizeCart();
    res.json({ success: true, archiveId: archive.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;