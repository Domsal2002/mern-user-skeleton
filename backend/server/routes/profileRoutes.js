const express = require("express");
const router = express.Router();
const profileModel = require("../models/profileModel");



// get all route
router.get('/getAll', async (req, res) => {
    const profile = await profileModel.find();
    return res.json(profile)
})




module.exports = router;