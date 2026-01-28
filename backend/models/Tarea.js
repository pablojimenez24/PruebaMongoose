const mongoose = require('mongoose');

const TareaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    tecnologia: { type: String },
    estado: { type: String, enum: ['pending', 'done'], default: 'pending' },
    fecha: { type: Date, default: Date.now }

}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Tareas', TareaSchema, 'Tareas');