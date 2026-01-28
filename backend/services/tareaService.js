
const Tarea = require('../models/Tarea');

exports.getAll = async () => {
    return await Tarea.find();
};

exports.getById = async (id) => {
    return await Tarea.findById(id);
};

exports.create = async (data) => {
    return await Tarea.create(data);
};

exports.update = async (id, data) => {
    return await Tarea.findByIdAndUpdate(id, data, { new: true });
};

exports.delete = async (id) => {
    return await Tarea.findByIdAndDelete(id);
};
