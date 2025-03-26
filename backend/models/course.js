const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true },
  fullName: { type: String, required: true },
  subject: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }, // Ensure required: true
  timing: { type: String, required: true },
  location: { type: String, required: true }
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
