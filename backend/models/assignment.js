const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true  },
  assignmentName: { type: String, required: true },
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
