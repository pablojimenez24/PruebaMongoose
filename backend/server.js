require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();

// 1. Conectar a Base de Datos
connectDB();

// 2. Middleware
app.use(cors({
    origin: true,  // Permite TODOS los orígenes (incluyendo file://)
    credentials: true
}));
app.use(express.json());
app.use(express.static('frontend')); // Servir archivos estáticos del frontend

// 3. Rutas
// app.use('/api/users', require('./routes/userRoutes'));

app.use('/api/tareas', require('./routes/tareaRoutes'));

app.get('/', (req, res) => {
    res.send('¡API funcionando sin dotenv! 🚀');
});

// 4. Iniciar Servidor (Puerto 3000 fijo)
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});