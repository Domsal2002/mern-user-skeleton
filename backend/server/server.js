const express = require("express");
const app = express();
const cors = require('cors');
const loginRoute = require('./routes/userLogin');
const getAllUsersRoute = require('./routes/userGetAllUsers');
const registerRoute = require('./routes/userSignUp');
const getUserByIdRoute = require('./routes/userGetUserById');
const dbConnection = require('./config/db.config');
const editUser = require('./routes/userEditUser');
const deleteUser = require('./routes/userDeleteAll');
const commentRoute = require('./routes/commentRoutes');
const createAdminRoute = require('./routes/adminRoutes');
const getAllAdminsRoute = require('./routes/adminGetAllRoute'); // Import the new route
const deleteAdminRoute = require('./routes/adminDelete'); // Import the new route
const profileRoute = require('./routes/profileRoutes');

require('dotenv').config();
const SERVER_PORT = 8081;

dbConnection();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Mounting routes
app.use('/user', loginRoute);
app.use('/user', registerRoute);
app.use('/user', getAllUsersRoute);
app.use('/user', getUserByIdRoute);
app.use('/user', editUser);
app.use('/user', deleteUser);
app.use('/comment', commentRoute);
app.use('/admin', createAdminRoute);
app.use('/admin', getAllAdminsRoute);
app.use('/admin', deleteAdminRoute); // Mount the new route here
app.use('/profile', profileRoute);

app.listen(SERVER_PORT, () => {
    console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
});
