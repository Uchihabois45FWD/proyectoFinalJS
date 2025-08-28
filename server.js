const express = require('express');
const path = require('path');

const app = express();

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Para manejar JSON en las peticiones

// Datos simulados (normalmente estarían en una base de datos)
let users = [
    {
        id: 1,
        username: "admin",
        password: "admin123",
        name: "Administrador Principal",
        email: "admin@escuela.com",
        role: "admin"
    },
    {
        id: 2,
        username: "estudiante1",
        password: "estudiante123",
        name: "Juan Pérez",
        email: "juan@escuela.com",
        role: "student"
    }
];

let requests = [
    {
        id: 1,
        userId: 2,
        userName: "Juan Pérez",
        sede: "Sede La Capri",
        fechaSalida: "2023-11-15",
        fechaRegreso: "2023-11-17",
        codigoComputadora: "PC-001",
        aceptoCondiciones: true,
        firma: "",
        estado: "aprobado",
        fechaSolicitud: "2023-11-14T10:30:00Z"
    }
];

let sedes = [
    { id: 1, nombre: "Sede La Capri" },
    { id: 2, nombre: "Sede Puntarenas" }
];

// Rutas para servir las páginas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages/index.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages/admin.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages/dashboard.html'));
});

app.get('/history.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages/history.html'));
});

// API Routes para usuarios
app.get('/api/users', (req, res) => {
    res.json(users);
});

app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
});

// API Routes para solicitudes
app.get('/api/requests', (req, res) => {
    res.json(requests);
});

app.get('/api/requests/:id', (req, res) => {
    const request = requests.find(r => r.id === parseInt(req.params.id));
    if (!request) return res.status(404).json({ message: 'Solicitud no encontrada' });
    res.json(request);
});

app.post('/api/requests', (req, res) => {
    const newRequest = {
        id: Date.now(), // ID temporal
        ...req.body
    };
    requests.push(newRequest);
    res.status(201).json(newRequest);
});

app.put('/api/requests/:id', (req, res) => {
    const index = requests.findIndex(r => r.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Solicitud no encontrada' });
    
    requests[index] = { ...requests[index], ...req.body };
    res.json(requests[index]);
});

app.delete('/api/requests/:id', (req, res) => {
    const index = requests.findIndex(r => r.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Solicitud no encontrada' });
    
    requests.splice(index, 1);
    res.status(204).send();
});

// API Routes para sedes
app.get('/api/sedes', (req, res) => {
    res.json(sedes);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});