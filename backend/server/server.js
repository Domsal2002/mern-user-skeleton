const express = require("express");
const app = express();
const cors = require('cors');

// Import routes
const loginRoute = require('./routes/userLogin');
const getAllUsersRoute = require('./routes/userGetAllUsers');
const registerRoute = require('./routes/userSignUp');
const getUserByIdRoute = require('./routes/userGetUserById');
const editUser = require('./routes/userEditUser');
const deleteUser = require('./routes/userDeleteAll');
const commentRoute = require('./routes/commentRoutes'); 
const createAdminRoute = require('./routes/adminRoutes');
const getAllAdminsRoute = require('./routes/adminGetAllRoute');
const deleteAdminRoute = require('./routes/adminDelete');
const profileRoute = require('./routes/profileRoutes');

// Database connection
const dbConnection = require('./config/db.config');

require('dotenv').config();
const SERVER_PORT = process.env.PORT || 8081;

// Initialize database connection
dbConnection();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Mount routes
app.use('/user', loginRoute);
app.use('/user', registerRoute);
app.use('/user', getAllUsersRoute);
app.use('/user', getUserByIdRoute);
app.use('/user', editUser);
app.use('/user', deleteUser);
app.use('/comment', commentRoute); 
app.use('/admin', createAdminRoute);
app.use('/admin', getAllAdminsRoute);
app.use('/admin', deleteAdminRoute);
app.use('/profile', profileRoute);

// Start the server
app.listen(SERVER_PORT, () => {
    console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
});
