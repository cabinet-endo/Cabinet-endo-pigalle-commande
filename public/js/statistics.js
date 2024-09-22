document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('statisticsChart').getContext('2d');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const statTypeSelect = document.getElementById('statType');
    const updateButton = document.getElementById('updateStats');
    let chart;

    // Initialiser les dates avec le mois en cours
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startDateInput.value = formatDate(firstDayOfMonth);
    endDateInput.value = formatDate(today);

    // Charger les statistiques initiales
    fetchStatistics();

    // Ajouter un écouteur d'événements pour le bouton de mise à jour
    updateButton.addEventListener('click', fetchStatistics);

    function fetchStatistics() {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        const statType = statTypeSelect.value;

        fetch(`/api/statistics?startDate=${startDate}&endDate=${endDate}&type=${statType}`)
            .then(response => response.json())
            .then(data => {
                updateChart(data, statType);
            })
            .catch(error => console.error('Error:', error));
    }

    function updateChart(data, statType) {
        const labels = data.map(item => item.name);
        const values = data.map(item => item.total);

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: statType === 'volume' ? 'Quantité totale commandée' : 'Coût total',
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Statistiques du ${startDateInput.value} au ${endDateInput.value}`
                    }
                }
            }
        });
    }

    function formatDate(date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }
});