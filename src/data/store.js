let materials = [];
let categories = [];
let cartItems = [];
let archives = [];
let nextMaterialId = 1;
let nextCategoryId = 1;
let nextCartItemId = 1;
let nextArchiveId = 1;

module.exports = {
  // Fonctions pour les matériaux
  getAllMaterials: () => materials,
  addMaterial: (material) => {
    const newMaterial = { ...material, id: nextMaterialId++ };
    materials.push(newMaterial);
    return newMaterial;
  },
  updateMaterial: (id, updatedMaterial) => {
    const index = materials.findIndex(m => m.id === id);
    if (index !== -1) {
      materials[index] = { ...materials[index], ...updatedMaterial };
      return materials[index];
    }
    return null;
  },
  deleteMaterial: (id) => {
    materials = materials.filter(m => m.id !== id);
  },

  // Fonctions pour les catégories
  getAllCategories: () => categories,
  addCategory: (category) => {
    const newCategory = { ...category, id: nextCategoryId++ };
    categories.push(newCategory);
    return newCategory;
  },
  deleteCategory: (id) => {
    categories = categories.filter(c => c.id !== id);
    materials = materials.map(m => m.categoryId === id ? {...m, categoryId: null} : m);
  },

  // Fonctions pour les articles du panier
  getAllCartItems: () => cartItems,
  addCartItem: (item) => {
    const material = materials.find(m => m.id === parseInt(item.materialId));
    if (!material) throw new Error("Matériel non trouvé");
    const newItem = { 
      id: nextCartItemId++, 
      materialId: material.id,
      name: material.name,
      quantity: parseInt(item.quantity),
      unitPrice: parseFloat(material.unitPrice),
      totalPrice: parseFloat(material.unitPrice) * parseInt(item.quantity),
      supplier_url: material.supplier_url,
      date: new Date().toISOString()
    };
    cartItems.push(newItem);
    return newItem;
  },
  deleteCartItem: (id) => {
    cartItems = cartItems.filter(item => item.id !== id);
  },

  // Fonctions pour les archives
  getAllArchives: () => archives,
  addArchive: (items) => {
    const newArchive = {
      id: nextArchiveId++,
      date: new Date().toISOString(),
      items: items
    };
    archives.push(newArchive);
    return newArchive;
  },
  getArchiveById: (id) => archives.find(a => a.id === parseInt(id)),

  // Fonction pour les statistiques
  getStatistics: (startDate, endDate, type = 'volume') => {
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();

    const allItems = [...cartItems, ...archives.flatMap(a => a.items)];
    const filteredItems = allItems.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });

    const stats = {};
    filteredItems.forEach(item => {
      if (stats[item.name]) {
        stats[item.name].quantity += item.quantity;
        stats[item.name].totalPrice += item.totalPrice;
      } else {
        stats[item.name] = { 
          quantity: item.quantity, 
          totalPrice: item.totalPrice 
        };
      }
    });

    return Object.entries(stats).map(([name, data]) => ({ 
      name, 
      total: type === 'volume' ? data.quantity : data.totalPrice 
    }));
  },

  // Fonction pour finaliser le panier
  finalizeCart: () => {
    if (cartItems.length === 0) {
      throw new Error("Le panier est vide");
    }
    const archivedItems = [...cartItems];
    const newArchive = module.exports.addArchive(archivedItems);
    cartItems = []; // Vider le panier
    return newArchive;
  }
};