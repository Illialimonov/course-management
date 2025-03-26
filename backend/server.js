const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 3000;
app.use(cors()); // Not for production

// Middleware
app.use(bodyParser.json());

// Import route files
const coursesRoute = require('./routes/courses');
const usersRoute = require('./routes/users');
const teachersRoute = require('./routes/teachers');
const adminsRoute = require('./routes/admin');

// Use routes
app.use('/courses', coursesRoute);
app.use('/users', usersRoute);
app.use('/teachers', teachersRoute);
app.use('/admins', adminsRoute);


// Connect to MongoDB and start server
mongoose.connect("mongodb://localhost:27017/node_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ MongoDB connected');

    // Only start server once DB is connected
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
})
.catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
});
