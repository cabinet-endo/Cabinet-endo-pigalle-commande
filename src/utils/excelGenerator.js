const XLSX = require('xlsx');

async function generateExcel(data) {
  // Préparer les données pour le fichier Excel
  const worksheetData = data.map(item => ({
    'ID': item.id,
    'Nom du matériel': item.name,
    'Quantité': item.quantity,
    'Date de commande': new Date().toLocaleDateString()
  }));

  // Créer une nouvelle feuille de calcul
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  // Créer un nouveau classeur
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Commandes");

  // Générer le buffer Excel
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

  return excelBuffer;
}

module.exports = generateExcel;