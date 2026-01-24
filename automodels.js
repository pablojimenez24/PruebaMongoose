const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// --- 1. CONFIGURACIÓN ---
// ¡PEGA AQUÍ TU ENLACE QUE YA FUNCIONA! (El mismo de database.js)
const MONGO_URI = 'mongodb+srv://pablo:ggI8Va36RIXMkri7@misbd.nf6po2t.mongodb.net/PruebaMongoose?appName=MisBD';

const MODELS_DIR = path.join(__dirname, 'models');

// Asegurar que existe la carpeta models
if (!fs.existsSync(MODELS_DIR)) fs.mkdirSync(MODELS_DIR);

// --- 2. MOTOR DE INFERENCIA DE TIPOS ---
function getType(value) {
    if (value === null || value === undefined) return 'mongoose.Schema.Types.Mixed'; // Si es null, usa Mixed
    if (typeof value === 'number') return 'Number';
    if (typeof value === 'boolean') return 'Boolean';
    if (value instanceof Date) return 'Date';
    if (typeof value === 'string') {
        // Intentar detectar si es una fecha en string ISO
        if (new Date(value).toString() !== 'Invalid Date' && value.includes('-')) return 'Date';
        return 'String';
    }
    if (Array.isArray(value)) return 'Array'; // Array genérico
    if (typeof value === 'object') {
        // Detectar ObjectId de Mongo
        if (value._bsontype === 'ObjectID') return 'mongoose.Schema.Types.ObjectId';
        return 'Object'; // Objeto anidado genérico
    }
    return 'mongoose.Schema.Types.Mixed';
}

// --- 3. PLANTILLA DEL MODELO ---
const getModelTemplate = (modelName, schemaObj) => `
const mongoose = require('mongoose');

const ${modelName}Schema = new mongoose.Schema({
${schemaObj}
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('${modelName}', ${modelName}Schema);
`;

// --- 4. FUNCIÓN PRINCIPAL ---
async function generateModels() {
    console.log("🚀 Conectando a MongoDB para leer datos...");
    
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Conectado. Escaneando colecciones...");

        const collections = await mongoose.connection.db.listCollections().toArray();

        for (const col of collections) {
            const colName = col.name;
            
            // Ignorar colecciones del sistema
            if (colName.startsWith('system.')) continue;

            console.log(`\n🔍 Analizando colección: ${colName}`);

            // Obtener UN documento de muestra
            const sampleData = await mongoose.connection.db.collection(colName).findOne({});

            if (!sampleData) {
                console.log(`   ⚠️  La colección '${colName}' está vacía. No puedo generar modelo.`);
                continue;
            }

            // Construir el esquema basado en ese documento
            let schemaEntries = '';
            for (const key in sampleData) {
                if (key === '_id' || key === '__v') continue; // Ignorar campos internos

                const type = getType(sampleData[key]);
                schemaEntries += `    ${key}: { type: ${type} },\n`;
            }

            // Convertir nombre de colección a nombre de Modelo (users -> User)
            // Quita la 's' final y pone mayúscula inicial (lógica básica)
            let modelName = colName.charAt(0).toUpperCase() + colName.slice(1);
            if (modelName.endsWith('s')) modelName = modelName.slice(0, -1);

            // Crear archivo
            const fileContent = getModelTemplate(modelName, schemaEntries);
            const filePath = path.join(MODELS_DIR, `${modelName}.js`);

            fs.writeFileSync(filePath, fileContent);
            console.log(`   ✨ Modelo generado: models/${modelName}.js`);
        }

        console.log("\n🏁 ¡Modelos generados! Ahora ejecuta autoCrud.js");
        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

generateModels();