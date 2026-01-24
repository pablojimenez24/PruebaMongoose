const mongoose = require('mongoose');

// PEGA AQUÍ TU ENLACE COMPLETO (Recuerda cambiar <password> por tu contraseña real)
const dbConnection = 'mongodb+srv://pablo:ggI8Va36RIXMkri7@misbd.nf6po2t.mongodb.net/PruebaMongoose?appName=MisBD';

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