const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  teachersname: String,
  password: String,
  role: { type: String, default: "teacher" } // ✅ ADD THIS
});

module.exports = mongoose.model('Teacher', teacherSchema, 'collteachers');