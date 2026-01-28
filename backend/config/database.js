const mongoose = require('mongoose');

// PEGA AQUÍ TU ENLACE COMPLETO (Recuerda cambiar <password> por tu contraseña real)
const dbConnection = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(dbConnection);
        console.log('✅ MongoDB Conectado exitosamente');
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;