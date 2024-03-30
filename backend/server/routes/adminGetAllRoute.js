const express = require("express");
const router = express.Router();
const adminModel = require('../models/adminModel');

router.get('/getAllAdmins', async (req, res) => {
    try {
        // Query all admins from the database
        const admins = await adminModel.find();
        
        // Return the list of admins as a response
        res.send(admins);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});

module.exports = router;
