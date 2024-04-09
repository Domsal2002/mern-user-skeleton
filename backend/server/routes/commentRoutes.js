const express = require("express");
const router = express.Router();
const commentModel = require("../models/commentModel");

// post/create comment route
router.post('/postComment/:lineID', async (req, res) => {
    const { username, text, } = req.body

    const { lineID } = req.params
    
    const createComment = new commentModel({
        username,
        text,
        lineID
    })

    try {
        const saveComment = await createComment.save()
        res.send(saveComment);
    } catch (error) {
        res.status(400).send({ message: "Error trying to create a new comment" });
    }
})

// get all route
router.get('/getAll/:lineID', async (req, res) => {
    const { lineID } = req.params;

    try {
        const comments = await commentModel.find({ lineID });
        return res.json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ message: "Error fetching comments" });
    }
});


// update comment route
router.put('/editComment/:id', async (req, res) => {
    try {
        const commentId = req.params.id;
        const newText = req.body.text;

        // Find the comment by ID
        const comment = await commentModel.findById(commentId);

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        // Update the comment's text
        comment.text = newText;
        await comment.save();

        res.json({ message: "Comment updated successfully", comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// delete comment route
router.delete('/deleteComment/:id', async (req, res) => {
    try {
        const commentId = req.params.id;

        // Find the comment by ID and delete it
        const deletedComment = await commentModel.findByIdAndDelete(commentId);

        if (!deletedComment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// Get comments by stopID
router.get('/getByStop/:lineID', async (req, res) => {
    try {
        const stopID = req.params.stopID;
        const comments = await Comment.find({ stopID });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error });
    }
});


module.exports = router;