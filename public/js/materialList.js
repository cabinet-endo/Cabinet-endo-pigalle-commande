document.addEventListener('DOMContentLoaded', () => {
    const categorizedMaterialList = document.getElementById('categorizedMaterialList');
    const addMaterialForm = document.getElementById('addMaterialForm');
    const addCategoryForm = document.getElementById('addCategoryForm');
    const categorySelect = document.getElementById('categoryId');

    fetchCategories();
    fetchMaterials();

    addCategoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('categoryName').value;
        addCategory({ name });
    });

    addMaterialForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const ideal_quantity = document.getElementById('ideal_quantity').value;
        const supplier_url = document.getElementById('supplier_url').value;
        const unit_price = document.getElementById('unit_price').value;
        const categoryId = document.getElementById('categoryId').value;

        addMaterial({ name, ideal_quantity, supplier_url, unitPrice: unit_price, categoryId });
    });

    function fetchCategories() {
        fetch('/api/material/categories')
            .then(response => response.json())
            .then(categories => {
                categorySelect.innerHTML = '<option value="">Sélectionner une catégorie</option>';
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    function fetchMaterials() {
        fetch('/api/material')
            .then(response => response.json())
            .then(materials => {
                const materialsByCategory = materials.reduce((acc, material) => {
                    if (!acc[material.categoryId]) {
                        acc[material.categoryId] = [];
                    }
                    acc[material.categoryId].push(material);
                    return acc;
                }, {});

                categorizedMaterialList.innerHTML = '';
                Object.entries(materialsByCategory).forEach(([categoryId, materials]) => {
                    const categoryName = categorySelect.querySelector(`option[value="${categoryId}"]`)?.textContent || 'Sans catégorie';
                    const categoryDiv = document.createElement('div');
                    categoryDiv.innerHTML = `<h3>${categoryName}</h3>`;
                    const ul = document.createElement('ul');
                    materials.forEach(material => {
                        const li = createMaterialListItem(material);
                        ul.appendChild(li);
                    });
                    categoryDiv.appendChild(ul);
                    categorizedMaterialList.appendChild(categoryDiv);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    function createMaterialListItem(material) {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="text" value="${material.name}" data-field="name">
            <input type="number" value="${material.ideal_quantity}" min="1" data-field="ideal_quantity">
            <input type="url" value="${material.supplier_url}" data-field="supplier_url">
            <input type="number" value="${material.unitPrice}" step="0.01" min="0" data-field="unitPrice">
            <button onclick="updateMaterial(${material.id})">Mettre à jour</button>
            <button onclick="deleteMaterial(${material.id})">Supprimer</button>
            <button onclick="addToCart(${material.id})">Ajouter au panier</button>
        `;
        return li;
    }

    function addCategory(category) {
        fetch('/api/material/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(category),
        })
        .then(response => response.json())
        .then(() => {
            fetchCategories();
            document.getElementById('categoryName').value = '';
        })
        .catch(error => console.error('Error:', error));
    }

    function addMaterial(material) {
        fetch('/api/material', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(material),
        })
        .then(response => response.json())
        .then(() => {
            fetchMaterials();
            addMaterialForm.reset();
        })
        .catch(error => console.error('Error:', error));
    }

    function updateMaterial(id) {
        const li = document.querySelector(`li button[onclick="updateMaterial(${id})"]`).parentNode;
        const updatedMaterial = {
            name: li.querySelector('[data-field="name"]').value,
            ideal_quantity: li.querySelector('[data-field="ideal_quantity"]').value,
            supplier_url: li.querySelector('[data-field="supplier_url"]').value,
            unitPrice: li.querySelector('[data-field="unitPrice"]').value
        };

        fetch(`/api/material/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedMaterial),
        })
        .then(response => response.json())
        .then(() => {
            fetchMaterials();
        })
        .catch(error => console.error('Error:', error));
    }

    function deleteMaterial(id) {
        fetch(`/api/material/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                fetchMaterials();
            } else {
                throw new Error('Erreur lors de la suppression');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function addToCart(materialId) {
        const li = document.querySelector(`li button[onclick="addToCart(${materialId})"]`).parentNode;
        const quantity = li.querySelector('[data-field="ideal_quantity"]').value;
        
        fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ materialId, quantity }),
        })
        .then(response => response.json())
        .then((data) => {
            alert(`${data.name} ajouté au panier`);
        })
        .catch(error => console.error('Error:', error));
    }

    window.updateMaterial = updateMaterial;
    window.deleteMaterial = deleteMaterial;
    window.addToCart = addToCart;
});