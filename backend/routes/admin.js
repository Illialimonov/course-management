const express = require('express');
const router = express.Router();
const Student = require('../models/user');
const Teacher = require('../models/teacher');
const mongoose = require('mongoose');
const Course = require('../models/course');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Assignment = require('../models/assignment');
const Grade = require('../models/grade');

require('dotenv').config();
const Admin = require('../models/admin');


// Get all students
router.get('/all-students', async (req, res) => {
    try {
        const result = await Student.find(); // ✅ Added `await` and used `find()`, not `findAll()`
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Get all students
router.get('/all-courses', async (req, res) => {
  try {
    const courses = await Course.find().populate('teacher', 'firstName lastName');

    const formattedCourses = courses.map(course => {
      const fullName = course.teacher
        ? `${course.teacher.firstName} ${course.teacher.lastName}`
        : 'Unknown';

      return {
        ...course.toObject(),
        teacher: fullName, // 👈 override the teacher field with name
      };
    });

    res.status(200).json(formattedCourses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Get all teachers
router.get('/all-teachers', async (req, res) => {
    try {
        const result = await Teacher.find();
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/course/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;
        const result = await Course.findById(courseId); // ✅ Use `findById` if you're using Mongo _id
        if (!result) return res.status(404).json({ error: "Teacher not found" });
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get a specific teacher by ID
router.get('/teacher/:teacherId', async (req, res) => {
    try {
        const { teacherId } = req.params;
        const result = await Teacher.findById(teacherId); // ✅ Use `findById` if you're using Mongo _id
        if (!result) return res.status(404).json({ error: "Teacher not found" });
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get a specific student by ID
router.get('/student/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const result = await Student.findById(studentId); // ✅ Same here
        if (!result) return res.status(404).json({ error: "Student not found" });
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/courses/teachers/:teacherId', async (req, res) => {
    try {
        const {teacherId} = req.params;
        // Find the teacher by ID
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        const courses = teacher.coursesTeaching;

        // Resolve all course details in parallel
        const result = await Promise.all(courses.map((course) => Course.findById(course)));

        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/courses/students/:studentId', async (req, res) => {
    try {
        const {studentId} = req.params;
        // Find the teacher by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        const courses = student.courses;

        // Resolve all course details in parallel
        const result = await Promise.all(courses.map((course) => Course.findById(course)));

        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



// Register Admin
router.post('/register', async (req, res) => {
    const { firstName, lastName, dateOfBirth, email, gender, password, phoneNumber } = req.body;

    try {
        // Check if user exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin already exists with that email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        const newAdmin = new Admin({
            firstName,
            lastName,
            dateOfBirth,
            email,
            gender,
            password: hashedPassword,
            phoneNumber
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Admin registered successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login Admin
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Create JWT token
        const accessToken = jwt.sign({ id: admin._id, email: admin.email }, process.env.SECRET_TOKEN, { expiresIn: '1h' });

        const refreshToken = jwt.sign(
  { id: admin._id, email: admin.email },
  process.env.SECRET_TOKEN,
  { expiresIn: '7d' }
);

res.status(200).json({ message: 'Login successful', accessToken, refreshToken });



    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/refresh', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

    try {
        const user = jwt.verify(refreshToken, process.env.SECRET_TOKEN);
        const email = user.email;


        // Issue a new access token
        const accessToken = jwt.sign({ email }, process.env.SECRET_TOKEN, { expiresIn: '15m' });


        const refreshToken = jwt.sign(
            {email: user.email},
            process.env.SECRET_TOKEN,
            { expiresIn: '7d' }
        );

        res.json({ email:user.email, accessToken, refreshToken });
    } catch (err) {
        console.log(process.env.SECRET_TOKEN);
        console.log(err);
        res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
});

module.exports = router;
