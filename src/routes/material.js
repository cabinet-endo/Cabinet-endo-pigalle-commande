const express = require('express');
const router = express.Router();
const store = require('../data/store');

// Routes pour les matériaux
router.get('/', (req, res) => {
  const materials = store.getAllMaterials();
  res.json(materials);
});

router.post('/', (req, res) => {
  const { name, ideal_quantity, supplier_url, unitPrice, categoryId } = req.body;
  const newMaterial = store.addMaterial({ name, ideal_quantity, supplier_url, unitPrice, categoryId });
  res.status(201).json(newMaterial);
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, ideal_quantity, supplier_url, unitPrice } = req.body;
  const updatedMaterial = store.updateMaterial(id, { name, ideal_quantity, supplier_url, unitPrice });
  if (updatedMaterial) {
    res.json(updatedMaterial);
  } else {
    res.status(404).json({ error: 'Matériel non trouvé' });
  }
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  store.deleteMaterial(id);
  res.sendStatus(204);
});

// Routes pour les catégories
router.get('/categories', (req, res) => {
  const categories = store.getAllCategories();
  res.json(categories);
});

router.post('/categories', (req, res) => {
  const { name } = req.body;
  const newCategory = store.addCategory({ name });
  res.status(201).json(newCategory);
});

router.delete('/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  store.deleteCategory(id);
  res.sendStatus(204);
});

module.exports = router;