// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Course = require('../models/course'); // Import Course model
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/teacher');



// Create a new user
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, dateOfBirth, gender, email, phoneNumber, password, coursesIds } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        if(allIdsAreValid(coursesIds)){
            const newUser = new User({ firstName, lastName, dateOfBirth, gender, email, phoneNumber, password:hashedPassword, courses:coursesIds });
            console.log("after NewUser");
            await newUser.save();
            res.status(201).json(newUser);
        } else {
            res.status(400).json({ error: 'One or more courses do not exist' });
        }
        
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });


    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const refreshToken = jwt.sign(
        {email: email },
        process.env.REFRESH_TOKEN_SECRET
    );

    const accessToken = jwt.sign({ email }, process.env.SECRET_TOKEN, { expiresIn: '1h' });
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



// Example route using the middleware
router.get('/me', authenticateUser, async (req, res) => {
    const user = await User.findOne({email: req.user.email});

    res.json({ _id:user.id, firstName: user.firstName, dateOfBirth:user.dateOfBirth , lastName:user.lastName, email:user.email, gender:user.gender, phoneNumber:user.phoneNumber, courses:user.courses  }); // Access user information from the token
});


router.post('/enroll', async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        // Validate inputs
        if (!studentId || !courseId) {
            return res.status(400).json({ error: "Student ID and Course ID are required." });
        }

        // Find the user by ID
        const user = await User.findById(studentId);

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Add course to user's courses array
        user.courses.push(courseId);

        // Save updated user
        await user.save();

        // Respond with updated user
        res.status(200).json("enrolled correctly");
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/unenroll', async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        // Validate inputs
        if (!studentId || !courseId) {
            return res.status(400).json({ error: "Student ID and Course ID are required." });
        }

        // Find the user by ID
        const user = await User.findById(studentId);

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Remove the course using filter
        const initialLength = user.courses.length;
        user.courses = user.courses.filter(id => !id.equals(courseId));

        // Check if the course was actually removed
        if (user.courses.length === initialLength) {
            return res.status(404).json({ error: "Course not found in user's courses." });
        }

        // Save the updated user
        await user.save();

        // Respond with the updated user
        res.status(200)
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//TODO REWORK
router.get('/my-grades', async (req, res) => {
    try {
        let sum=0;
        let counter=0;
        const { courseId, studentId } = req.query; // Extract query parameters
        if (!courseId || !studentId) {
            return res.status(400).json({ error: 'both are required!' });
        }

        const result = {};

        const student = await User.findById(studentId);
        
        result["name"]=student.firstName + " " + student.lastName;



        const assignmentsForCourse = await Assignment.find({courseId});

        for (let assignment of assignmentsForCourse){
            const studentGrade = await Grade.findOne({studentId, assignmentId : assignment._id});
            if (studentGrade === null){
                result[removeWhitespaces(assignment.assignmentName)]="N/A";
            } else {
            sum+=studentGrade.grade;
            counter++;
            result[removeWhitespaces(assignment.assignmentName)]=studentGrade.grade;
            }
        }

        const avg = sum/counter;
        result["average"]=avg




        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//returns all the user's with a certain course
router.get('/course', async (req, res) => {
    try {
        const { courseId } = req.query; // Use req.query for GET requests
        if (!courseId) {
            return res.status(400).json({ error: 'courseId is required' });
        }

        let result = [];
        const users = await User.find(); // Fetch all users

        for (let user of users) {
            
            if (user.courses.includes(courseId)) {
                const course = await Course.findById(courseId);
                if (course) {
                    
                    result.push(user);
                }
            }
        }

        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



//returns all the user's with a certain course
router.get('/my-courses', authenticateUser, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const courses = user.courses;

        // Fetch courses and their teachers in parallel
        const result = await Promise.all(
            courses.map(async (courseId) => {
                const course = await Course.findById(courseId);
                if (!course) {
                    throw new Error(`Course with ID ${courseId} not found`);
                }

                const teacher = await Teacher.findById(course.teacher);
                if (!teacher) {
                    throw new Error(`Teacher with ID ${course.teacher} not found`);
                }

                const teacherName = `${teacher.firstName} ${teacher.lastName}`;
                return { ...course.toObject(), teacher: teacherName }; // Return a new object with teacherName
            })
        );

        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});







// // Get user by ID
// router.get('/:id', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         res.json(user);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });




// Delete user by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


async function allIdsAreValid(coursesIds) {
    // Check if coursesIds is a valid array of ObjectIds
    if (!Array.isArray(coursesIds) || !coursesIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
        return false;
    }

    // Fetch the courses from the database
    const courses = await Course.find({ '_id': { $in: coursesIds } });

    // Check if all course IDs match
    return courses.length === coursesIds.length;
}


module.exports = router;
