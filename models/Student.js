const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({

  studentno: String,
  studentname: String,
  studentlname: String,
  gradelevel: String,

  subjects: [
    {
      subject: String,
      teacher: String,
      status: {
        type: String,
        default: "Pending"
      },
      comments: {
        type: String,
        default: ""
      }
    }
  ]

});

module.exports = mongoose.model('Student', studentSchema, 'dtbschoolclearance');