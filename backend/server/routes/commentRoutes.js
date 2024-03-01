const express = require("express");
const router = express.Router();
const commentModel = require("../models/commentModel");

// post/create comment route
router.post('/postComment', async (req, res) => {
    const {username, text} = req.body

    const createComment = new commentModel({
        username: req.body.username,
        text: req.body.text
    })

    try {
        const saveComment = await createComment.save()
        res.send(saveComment);
    } catch (error) {
        res.status(400).send({message: "Error trying to create a new comment"});
    }
})

// get all route
router.get('/getAll', async (req, res) => {
    const comment = await commentModel.find();
    return res.json(comment)
})

// update comment route
router.put('/editComment', async (req, res) => {
    const comment = await commentModel.updateOne();
    return res.json(comment)
})
// delete comment route
router.delete('deleteOne', async (req, res) => {
    const comment = await commentModel.deleteOne();
    return res.json(comment)
})

module.exports = router;