const express = require("express");
const router = express.Router();
const adminModel = require('../models/adminModel');

// Route to delete an admin by username
router.delete('/deleteAdmin', async (req, res) => {
    const { username } = req.body;

    try {
        // Find the admin by username and delete it
        const deletedAdmin = await adminModel.findOneAndDelete({ username: username });

        if (deletedAdmin) {
            res.send({ message: "Admin deleted successfully", deletedAdmin });
        } else {
            res.status(404).send({ message: "Admin not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});

module.exports = router;
