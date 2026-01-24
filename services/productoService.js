
const Producto = require('../models/Producto');

exports.getAll = async () => {
    return await Producto.find();
};

exports.getById = async (id) => {
    return await Producto.findById(id);
};

exports.create = async (data) => {
    return await Producto.create(data);
};

exports.update = async (id, data) => {
    return await Producto.findByIdAndUpdate(id, data, { new: true });
};

exports.delete = async (id) => {
    return await Producto.findByIdAndDelete(id);
};
