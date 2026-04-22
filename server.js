const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Student = require('./models/Student');
const Teacher = require('./models/Teacher');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// GET ALL STUDENTS
app.get('/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// FILTER BY GRADE LEVEL
app.get('/students/grade/:grade', async (req, res) => {
  const students = await Student.find({ gradelevel: req.params.grade });
  res.json(students);
});

// UPDATE CLEARANCE STATUS
app.put('/students/:id', async (req, res) => {
  try {
    const { subject, status, comments } = req.body;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // ✅ FIND SUBJECT SAFELY
    const sub = student.subjects.find(
      s => s.subject.toLowerCase().trim() === subject.toLowerCase().trim()
    );

    if (!sub) {
      return res.status(404).json({ error: "Subject not found" });
    }

    // ✅ UPDATE SUBJECT ONLY
    sub.status = status;
    sub.comments = comments;

    await student.save();

    // ✅ RE-COMPUTE OVERALL STATUS
    const statuses = student.subjects.map(s => s.status);

    if (statuses.every(s => s === "Cleared")) {
      student.status = "Cleared";
    } else if (statuses.some(s => s === "Not Cleared")) {
      student.status = "Not Cleared";
    } else {
      student.status = "Pending";
    }

    await student.save();

    res.json(student);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.post('/students', async (req, res) => {
  try {
    console.log("Incoming data:", req.body); // 👈 DEBUG

    const student = new Student(req.body);
    await student.save();

    res.json(student);
  } catch (err) {
    console.error("SAVE ERROR:", err); // 👈 VERY IMPORTANT
    res.status(500).json({ error: err.message });
  }
});

app.delete('/students/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.get('/students/:id', async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.json(student);
});

app.post('/teachers', async (req, res) => {
  try {
  const teacher = new Teacher({
    teachersname: req.body.teachersname.trim().toUpperCase(),
    password: req.body.password,
    role: req.body.role || "teacher"
  });

    await teacher.save();
    res.json(teacher);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/*
app.post('/teachers/login', async (req, res) => {
  let teachersname = (req.body.teachersname || "").trim().toUpperCase();
  let password = (req.body.password || "").trim();

  const teacher = await Teacher.findOne({
    teachersname,
    password
  });

  if (!teacher) {
    return res.status(401).json({ error: "Invalid login" });
  }

  res.json({
    teachersname: teacher.teachersname,
    role: teacher.role
  });
});
*/
app.post('/teachers/login', async (req, res) => {
  try {
    let teachersname = (req.body.teachersname || "").trim();
    let password = (req.body.password || "").trim();

    const teacher = await Teacher.findOne({
      teachersname: teachersname,
      password: password
    });

    if (!teacher) {
      return res.status(401).json({ error: "Invalid login" });
    }

    res.json({
      teachersname: teacher.teachersname,
      role: teacher.role
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/students/bulk', async (req, res) => {
  try {
    const { students } = req.body;

    if (!Array.isArray(students)) {
      return res.status(400).json({ error: "Invalid format" });
    }

    // optional: remove invalid rows
    const cleanStudents = students.filter(s =>
      s.studentno && s.studentname && s.gradelevel
    );

    const result = await Student.insertMany(cleanStudents, {
      ordered: false // continues even if one fails
    });

    res.json({
      inserted: result.length,
      message: "Bulk upload successful"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/teachers', async (req, res) => {
  const teachers = await Teacher.find();
  res.json(teachers);
});

app.delete('/teachers/:id', async (req, res) => {
  await Teacher.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.put('/teachers/:id', async (req, res) => {
  try {
    const { teachersname, password, role } = req.body;

    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    teacher.teachersname = teachersname;
    teacher.password = password;
    teacher.role = role || teacher.role; // ✅ THIS FIXES YOUR ISSUE

    await teacher.save();

    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});