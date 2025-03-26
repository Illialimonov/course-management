const express = require('express');
const router = express.Router();

const Teacher = require('../models/teacher');
const Course = require('../models/course');
const mongoose = require('mongoose');

// Create a new (course)
router.post('/', async (req, res) => {
    try {
        const { courseCode, fullName, subject, teacherId, timing, location } = req.body;
        if (await allIdsAreValid(teacherId)) {
            // Create the new course
            console.log("inside?");
            const newCourse = new Course({ 
                courseCode, fullName, subject, teacher: teacherId, timing, location 
            });
            await newCourse.save();

            // Add the course to the teacher's teachingCourses
            const teacher = await Teacher.findById(teacherId);
            console.log(teacher);
            if (!teacher) {
                return res.status(404).json({ error: 'Teacher not found' });
            }
            teacher.coursesTeaching.push(newCourse._id);
            await teacher.save();


            res.status(201).json({ message: 'Course created successfully' });
        } else {
            res.status(400).json({ error: 'som wron' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get("/", async (req, res) => {
  try {
    const result = await Course.find();
    return res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching courses:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// Delete a course by ID
router.delete('/:id', async (req, res) => {
    try {
        const courseId = req.params.id;

        // Find the course by ID
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Remove the course from the teacher's teachingCourses array
        const teacher = await Teacher.findById(course.teacher);
        if (teacher) {
            teacher.coursesTeaching = teacher.coursesTeaching.filter(courseId => !course._id.equals(courseId));
            await teacher.save();
        }

    

        // Delete the course from the database
        await Course.findByIdAndDelete(courseId);

        res.json({ message: 'Course and associated data deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});




// Helper function to validate IDs
async function allIdsAreValid(teacherId) {
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {

        return false; // Invalid teacher ID
    }

    // Validate teacher existence
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
        return false; // Teacher not found
    }

    

    return true;

}
module.exports = router;
