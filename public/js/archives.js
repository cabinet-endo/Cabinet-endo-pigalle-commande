document.addEventListener('DOMContentLoaded', () => {
    const archivesList = document.getElementById('archivesList');

    fetchArchives();

    function fetchArchives() {
        fetch('/api/archives')
            .then(response => response.json())
            .then(archives => {
                archivesList.innerHTML = '';
                archives.forEach(archive => {
                    const archiveElement = createArchiveElement(archive);
                    archivesList.appendChild(archiveElement);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    function createArchiveElement(archive) {
        const div = document.createElement('div');
        div.className = 'archive-item';
        div.innerHTML = `
            <h3>Commande du ${new Date(archive.date).toLocaleDateString()}</h3>
            <ul>
                ${archive.items.map(item => `<li>${item.name} - Quantité: ${item.quantity} - Prix total: ${item.totalPrice}€</li>`).join('')}
            </ul>
            <a href="/api/archives/${archive.id}/excel" download>Télécharger Excel</a>
            <button onclick="deleteArchive(${archive.id})">Supprimer</button>
        `;
        return div;
    }

    function deleteArchive(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette archive ?')) {
            fetch(`/api/archives/${id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                    fetchArchives();
                } else {
                    throw new Error('Erreur lors de la suppression');
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    window.deleteArchive = deleteArchive;
});