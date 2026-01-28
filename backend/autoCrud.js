const fs = require('fs');
const path = require('path');

// --- CONFIGURACIÓN ---
const PATHS = {
    models: path.join(__dirname, 'models'),
    services: path.join(__dirname, 'services'),
    controllers: path.join(__dirname, 'controllers'),
    routes: path.join(__dirname, 'routes')
};

// Asegurarse de que las carpetas de destino existen
Object.values(PATHS).forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// --- PLANTILLAS (Templates) ---

const getServiceTemplate = (nameCap, nameLower) => `
const ${nameCap} = require('../models/${nameCap}');

exports.getAll = async () => {
    return await ${nameCap}.find();
};

exports.getById = async (id) => {
    return await ${nameCap}.findById(id);
};

exports.create = async (data) => {
    return await ${nameCap}.create(data);
};

exports.update = async (id, data) => {
    return await ${nameCap}.findByIdAndUpdate(id, data, { new: true });
};

exports.delete = async (id) => {
    return await ${nameCap}.findByIdAndDelete(id);
};
`;

const getControllerTemplate = (nameCap, nameLower) => `
const ${nameLower}Service = require('../services/${nameLower}Service');

exports.getAll = async (req, res) => {
    try {
        const items = await ${nameLower}Service.getAll();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const item = await ${nameLower}Service.getById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newItem = await ${nameLower}Service.create(req.body);
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const updatedItem = await ${nameLower}Service.update(req.params.id, req.body);
        if (!updatedItem) return res.status(404).json({ error: 'Not found' });
        res.json(updatedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const deletedItem = await ${nameLower}Service.delete(req.params.id);
        if (!deletedItem) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
`;

const getRouteTemplate = (nameCap, nameLower) => `
const express = require('express');
const router = express.Router();
const ${nameLower}Controller = require('../controllers/${nameLower}Controller');

router.get('/', ${nameLower}Controller.getAll);
router.get('/:id', ${nameLower}Controller.getById);
router.post('/', ${nameLower}Controller.create);
router.put('/:id', ${nameLower}Controller.update);
router.delete('/:id', ${nameLower}Controller.delete);

module.exports = router;
`;

// --- FUNCIÓN PRINCIPAL ---

function generateAll() {
    console.log("🚀 Iniciando generador de CRUD masivo...");

    if (!fs.existsSync(PATHS.models)) {
        console.error("❌ Error: No encuentro la carpeta 'models'.");
        return;
    }

    // Leer todos los archivos de la carpeta models
    const files = fs.readdirSync(PATHS.models);

    files.forEach(file => {
        // Ignorar archivos que no sean .js o archivos index.js
        if (!file.endsWith('.js') || file === 'index.js') return;

        // Extraer nombre (ej: "User.js" -> "User")
        const modelNameCap = file.replace('.js', ''); 
        const modelNameLower = modelNameCap.charAt(0).toLowerCase() + modelNameCap.slice(1);

        console.log(`\n⚙️  Procesando modelo: ${modelNameCap}`);

        // 1. Generar Service
        createFile(
            PATHS.services, 
            `${modelNameLower}Service.js`, 
            getServiceTemplate(modelNameCap, modelNameLower)
        );

        // 2. Generar Controller
        createFile(
            PATHS.controllers, 
            `${modelNameLower}Controller.js`, 
            getControllerTemplate(modelNameCap, modelNameLower)
        );

        // 3. Generar Route
        createFile(
            PATHS.routes, 
            `${modelNameLower}Routes.js`, 
            getRouteTemplate(modelNameCap, modelNameLower)
        );
    });

    console.log("\n✨ ¡Proceso finalizado! Revisa tus carpetas.");
}

// Función auxiliar para escribir archivo solo si no existe
function createFile(folderPath, fileName, content) {
    const fullPath = path.join(folderPath, fileName);
    
    if (fs.existsSync(fullPath)) {
        console.log(`   ⚠️  Saltado (Ya existe): ${fileName}`);
    } else {
        fs.writeFileSync(fullPath, content);
        console.log(`   ✅ Creado: ${fileName}`);
    }
}

// Ejecutar script
generateAll();