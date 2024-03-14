const express = require("express");
const router = express.Router();
const profileModel = require("../models/profileModel");



// get all route
router.get('/getAll', async (req, res) => {
    const profile = await profileModel.find();
    return res.json(profile)
})

//create profile route
router.post('/createProfile', async (req, res) => {
        const { username, email, password, bio } = req.body;
    
        const createProfile = new profileModel({
            username: username,
            email: email,
            password: password,
            bio: bio
        });
    
        try {
            const saveProfile = await createProfile.save()
            res.send(saveProfile);
        } catch (error) {
            console.error('Error creating profile:', error);
            res.status(400).send({ message: "Error trying to create profile", error });
        }
    });
      

//edit profile route
router.post('/editProfile', async (req, res) => {
    const { bio } = req.body;
    const { username } = req.params;
    try {
        const profileId = req.params.id;

        // Find the profile by ID
        const profile = await profileModel.findOne(username);

        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }
     
     profile.bio = bio;
     await profile.save();

     res.json({ message: "Profile updated successfully", profile });
 } catch (error) {
     console.error(error);
     res.status(500).json({ error: "Internal server error" });
 }
})
    


   
    //delete profile route
    router.delete('/deleteProfile', async (req, res) => {
        const { username } = req.body;
    
        try {
            const profile = await profileModel.findOneAndDelete(username);
          if (!profile) {
            return res.status(404).send("Profile not found");
          }
          res.json(profile);
        } catch (error) {
          console.error(error);
          return res.status(500).send("Internal server error");
        }

    })
module.exports = router;