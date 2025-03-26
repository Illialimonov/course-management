// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Teacher = require('../models/teacher');
const mongoose = require('mongoose');
const Course = require('../models/course');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Assignment = require('../models/assignment');
const Grade = require('../models/grade');

require('dotenv').config();

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token part
    try {
        jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
            if (err) return res.status(403).json({ error: 'Invalid or expired token' });
            req.user = user; // Attach user payload
            next();
        });
    } catch (err) {
        res.status(403).json({ error: err.message });
    }
};

router.get("/", async (req, res) => {
  try {
    const result = await Teacher.find();
    return res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching courses:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE a teacher by ID
router.delete('/:teacherId', authenticateUser, async (req, res) => {
  try {
    const { teacherId } = req.params;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ error: 'Invalid teacher ID' });
    }

    // Find and delete the teacher
    const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);

    if (!deletedTeacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    await Course.updateMany(
  { teacher: new mongoose.Types.ObjectId(teacherId) },
  { $unset: { teacher: "" } } // preferred over setting it to empty string
);


    return res.status(200).json({ message: 'Teacher successfully deleted' });
  } catch (err) {
    console.error('Error deleting teacher:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});





// Create a new teacher
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, password, email, gender, dateOfBirth, department, phoneNumber, coursesTeachingIds } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        if(allIdsAreValid(coursesTeachingIds)){
            const newTeacher = new Teacher({ firstName, lastName, dateOfBirth, gender, email, phoneNumber, department, password:hashedPassword, coursesTeaching:coursesTeachingIds });
            await newTeacher.save();
            res.status(201).json(newTeacher);

        } else {
            res.status(400).json({ error: 'One or more courses do not exist' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/assignment', authenticateUser, async (req, res) => {
    try {
        const user = await Teacher.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        let { courseId, assignmentName } = req.body;

        // Check if courseId or assignmentName is missing
        if (!courseId || !assignmentName) {
            return res.status(400).json({ error: 'Course ID and assignment name are required' });
        }

        // Validate courseId (assuming validCourseId is a function that checks if the courseId is valid)
        if (!validCourseId(courseId)) {
            return res.status(400).json({ error: 'Course is not a valid ID' });
        }

        // Create new assignment
        const assignment = new Assignment({ courseId, assignmentName});

        // Save the assignment to the database
        await assignment.save();

        res.status(201).json({ message: 'Assignment successfully created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/assignment/:assignmentId', authenticateUser, async (req, res) => {
    try {
      const user = await Teacher.findOne({ email: req.user.email });
      if (!user) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
  
      const { assignmentId } = req.params; // Access the assignmentId from the URL params
  
      // Find the assignment to delete
      const assignment = await Assignment.findByIdAndDelete(assignmentId);
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }
  
      res.status(200).json({ message: 'Assignment successfully deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  



router.get('/assignment/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params; // Extract courseId from request parameters
        const result = await Assignment.find({ courseId }); // Find assignments by courseId

        res.status(200).json(result); // Return results with a 200 status
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Server error' }); // Return a 500 status with an error message
    }
});

// get users grade on assignments for a certain courseId
router.get('/grade', async (req, res) => {
    const { courseId } = req.query;

    if (!courseId) {
        return res.status(400).json({ error: 'courseId is required!' });
    }

    let users = [];

    const allUsers = await User.find(); // Fetch all users

    for (let user of allUsers) {
        if (user.courses.includes(courseId)) {
            const course = await Course.findById(courseId);
            if (course) {
                users.push(user);
            }
        }
    }

    const result = [];

    for (let student of users) {
        let internalResult = {}
        console.log(student);
        try {
            let sum = 0;
            let counter = 0;

            internalResult["id"] = student.id;

            internalResult["name"] = student.firstName + " " + student.lastName;
            
            const assignmentsForCourse = await Assignment.find({ courseId });

            for (let assignment of assignmentsForCourse) {
                const studentGrade = await Grade.findOne({
                    studentId: student._id,
                    assignmentId: assignment._id,
                });

                if (studentGrade === null) {
                    internalResult[removeWhitespaces(assignment.assignmentName)] = "N/A";
                } else {
                    sum += studentGrade.grade;
                    counter++;
                    internalResult[removeWhitespaces(assignment.assignmentName)] = studentGrade.grade;
                }
            }

            if (sum==0){ internalResult["average"] = "N/A";}
            else {
                const avg = sum / counter;
            internalResult["average"] = avg;
            }

            
            result.push(internalResult);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    res.json(result);
});






router.post('/grades', authenticateUser, async (req, res) => {
    try {
        const user = await Teacher.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        const { grades } = req.body; // Expecting an array of { studentId, assignmentId, grade }

        if (!Array.isArray(grades) || grades.length === 0) {
            return res.status(400).json({ error: 'Invalid or empty grades array' });
        }

        const validGrades = [];


        for (const { studentId, assignmentId, grade } of grades) {
            const student = await User.findById(studentId);
            const assignment = await Assignment.findById(assignmentId);

            if (!student || !assignment) {
                res.status(404).json({ error: 'Invalid student or assignment!' });
            }

            validGrades.push({ studentId, assignmentId, grade });
        }

        if (validGrades.length > 0) {
            await Grade.insertMany(validGrades);
        }

        res.status(201).json({
            message: 'Grades processed',
            saved: validGrades.length,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email });


    if (!teacher) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const accessToken = jwt.sign({ email }, process.env.SECRET_TOKEN, { expiresIn: '1h' });
    const refreshToken = jwt.sign(
        {email: email },
        process.env.REFRESH_TOKEN_SECRET
    );

     // Add user roles/ID as needed
    res.json({ email, accessToken, refreshToken });
});

router.post('/refresh', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

    try {
        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const email = user.email;


        // Issue a new access token
        const accessToken = jwt.sign({ email }, process.env.SECRET_TOKEN, { expiresIn: '15m' });


        const newRefreshToken = jwt.sign(
            {email: user.email},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ email:user.email, accessToken, newRefreshToken });
    } catch (err) {
        console.log(process.env.REFRESH_TOKEN_SECRET);
        console.log(err);
        res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
});









// Example route using the middleware
router.get('/me', authenticateUser, async (req, res) => {

    const user = await Teacher.findOne({email: req.user.email});

    res.json({ _id:user.id, firstName: user.firstName, dateOfBirth:user.dateOfBirth , lastName:user.lastName, email:user.email, gender:user.gender, phoneNumber:user.phoneNumber, courses:user.courses, department: user.department }); // Access user information from the token
    // Access user information from the token
});





// Get all the courses from 1 teacher
router.get('/my-courses', authenticateUser, async (req, res) => {
    try {
        
        // Find the teacher by ID
        const teacher = await Teacher.findOne({email: req.user.email});
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        // Get coursesTeaching from the teacher
        const courses = teacher.coursesTeaching;

        // Resolve all course details in parallel
        const result = await Promise.all(courses.map((course) => Course.findById(course)));

        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});





// Get all Teacher
router.get('/', async (req, res) => {
    try {
        const Teacher = await Teacher.find();
        res.json(Teacher);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



async function allIdsAreValid(coursesIds) {
    if (!Array.isArray(coursesIds) || !coursesIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
        return false;
    }

    // Use `findOne` to check if each course exists, which is more efficient
    for (let courseId of coursesIds) {
        const course = await Course.findById(courseId);
        if (!course) {
            return false;
        }
    }

    return true;
}


async function validCourseId(courseId) {
    const course = await Course.findById(courseId);
        if (!course) {
            return false;
        }

        

    return true;
}

function removeWhitespaces(str) {
    return str.replace(/\s+/g, ""); // Removes all whitespaces
  }


module.exports = router;
