const express = require('express');
const connectDB = require('./config/database');

const app = express();

// 1. Conectar a Base de Datos
connectDB();

// 2. Middleware
app.use(express.json());

// 3. Rutas
// app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/productos', require('./routes/productoRoutes'));
app.get('/', (req, res) => {
    res.send('¡API funcionando sin dotenv! 🚀');
});

// 4. Iniciar Servidor (Puerto 3000 fijo)
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});