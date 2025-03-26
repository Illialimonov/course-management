const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    department: { type: String, required: true },
    coursesTeaching: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' , required: true}]
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;