const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rutas específicas para cada página HTML
app.get('/admin', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'admin.html');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Página no encontrada');
    }
});

app.get('/dashboard', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'dashboard.html');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Página no encontrada');
    }
});

app.get('/history', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'history.html');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Página no encontrada');
    }
});

// Ruta para manejar archivos CSS y JS correctamente
app.get('/css/:file', (req, res) => {
    const file = req.params.file;
    const filePath = path.join(__dirname, 'public', 'css', file);
    
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Archivo CSS no encontrado');
    }
});

app.get('/js/:file', (req, res) => {
    const file = req.params.file;
    const filePath = path.join(__dirname, 'public', 'js', file);
    
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Archivo JS no encontrado');
    }
});

// Puerto
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    console.log('Rutas disponibles:');
    console.log('- http://localhost:3000/');
    console.log('- http://localhost:3000/admin');
    console.log('- http://localhost:3000/dashboard');
    console.log('- http://localhost:3000/history');
});