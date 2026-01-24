
const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    nombre: { type: String },
    descripcion: { type: String },
    precio: { type: Number },
    stock: { type: Number },
    enVenta: { type: Boolean },
    categoria: { type: String },
    tags: { type: Array },
    specs: { type: Object },

}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Productos', ProductoSchema, 'Productos');
