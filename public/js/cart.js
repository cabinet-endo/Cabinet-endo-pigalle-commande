document.addEventListener('DOMContentLoaded', () => {
    const cartList = document.getElementById('cartList');
    const finalizeButton = document.getElementById('finalizeAndDownload');

    fetchCart();

    finalizeButton.addEventListener('click', finalizeAndDownload);

    function fetchCart() {
        fetch('/api/cart')
            .then(response => response.json())
            .then(items => {
                cartList.innerHTML = '';
                items.forEach(item => {
                    const li = createCartListItem(item);
                    cartList.appendChild(li);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    function createCartListItem(item) {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.name} - Quantité: ${item.quantity} - Prix unitaire: ${item.unitPrice}€ - Total: ${item.totalPrice}€
            <a href="${item.supplier_url}" target="_blank">Lien fournisseur</a>
            <button onclick="removeFromCart(${item.id})">Supprimer</button>
        `;
        return li;
    }

    function removeFromCart(id) {
        fetch(`/api/cart/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                fetchCart();
            } else {
                throw new Error('Erreur lors de la suppression');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function finalizeAndDownload() {
        fetch('/api/cart/finalize', {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Commande finalisée et archivée avec succès');
                window.location.href = `/api/archives/${data.archiveId}/excel`;
                fetchCart();
            } else {
                throw new Error('Erreur lors de la finalisation');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Une erreur est survenue lors de la finalisation de la commande');
        });
    }

    window.removeFromCart = removeFromCart;
});