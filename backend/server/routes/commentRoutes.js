const express = require("express");
const router = express.Router();
const commentModel = require("../models/commentModel");

// post/create comment route
router.post('/postComment', async (req, res) => {
    const { username, text } = req.body

    const createComment = new commentModel({
        username: req.body.username,
        text: req.body.text
    })

    try {
        const saveComment = await createComment.save()
        res.send(saveComment);
    } catch (error) {
        res.status(400).send({ message: "Error trying to create a new comment" });
    }
})

// get all route
router.get('/getAll', async (req, res) => {
    const comment = await commentModel.find();
    return res.json(comment)
})

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

module.exports = router;