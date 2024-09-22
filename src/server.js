const express = require('express');
const path = require('path');
const materialRoutes = require('./routes/material');
const cartRoutes = require('./routes/cart');
const statisticsRoutes = require('./routes/statistics');
const archivesRoutes = require('./routes/archives');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Routes
app.use('/api/material', materialRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/archives', archivesRoutes);

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/materialList', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'materialList.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'cart.html'));
});

app.get('/statistics', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'statistics.html'));
});

app.get('/archives', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'archives.html'));
});

// Handle 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});