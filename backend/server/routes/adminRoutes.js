const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const adminModel = require('../models/adminModel');

router.post('/grantAdmin', async (req, res) => {
    const { username } = req.body;

    try {
        // Check if admin with the given username already exists
        const existingAdmin = await adminModel.findOne({ username: username });
        
        // If admin already exists, return error
        if (existingAdmin) {
            return res.status(400).send({ message: "Admin with this username already exists" });
        }

        // Create a new admin
        const newAdmin = new adminModel({
            username: username,
            isAdmin: true // Assuming the newly created admin should have admin privileges
        });

        // Save the new admin to the database
        await newAdmin.save();

        res.send({ message: "Admin has been created and granted admin privileges" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});

module.exports = router;
