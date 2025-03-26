const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
});

const User = mongoose.model('Admin', adminSchema);

module.exports = User;