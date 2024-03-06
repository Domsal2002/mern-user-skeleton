const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require('../models/userModel');

router.post('/grantAdmin/:username', async (req, res) => {
    const username = req.params.username;

    try {
        // Find the user by username
        const user = await UserModel.findOne({ username: username });
        
        // Check if user exists
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Check if the user is already an admin
        if (user.isAdmin) {
            return res.status(400).send({ message: "User is already an admin" });
        }

        // Mark the user as an admin
        user.isAdmin = true;

        // Save the updated user
        await user.save();

        res.send({ message: "User has been granted admin privileges" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});

module.exports = router;
