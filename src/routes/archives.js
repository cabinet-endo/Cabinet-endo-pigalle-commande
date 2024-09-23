const express = require('express');
const router = express.Router();
const store = require('../data/store');
const XLSX = require('xlsx');

router.get('/', (req, res) => {
  const archives = store.getAllArchives();
  res.json(archives);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const success = store.deleteArchive(id);
  if (success) {
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: 'Archive non trouvée' });
  }
});

router.get('/:id/excel', (req, res) => {
  const id = parseInt(req.params.id);
  const archive = store.getArchiveById(id);
  if (!archive) {
    return res.status(404).json({ error: 'Archive non trouvée' });
  }

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(archive.items);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Commande");
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  
  res.setHeader('Content-Disposition', `attachment; filename=commande_${archive.date}.xlsx`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(excelBuffer);
});

module.exports = router;