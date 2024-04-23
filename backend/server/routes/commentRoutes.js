const express = require("express");
const router = express.Router();
const commentModel = require("../models/commentModel");

// POST/create comment route
router.post('/postComment/:lineID', async (req, res) => {
    const { username, text, stationID } = req.body;  // Include stationID from the request body
    const { lineID } = req.params;

    const createComment = new commentModel({
        username,
        text,
        lineID,
        stationID  // Save stationID in the database, can be undefined if not provided
    });

    try {
        const saveComment = await createComment.save();
        res.send(saveComment);
    } catch (error) {
        res.status(400).send({ message: "Error trying to create a new comment" });
    }
});

// GET all route by line and optionally by station
router.get('/getAll/:lineID/:stationID?', async (req, res) => {
    const { lineID, stationID } = req.params;

    let query = { lineID };
    if (stationID) query.stationID = stationID;  // Include stationID in the query if provided

    try {
        const comments = await commentModel.find(query);
        return res.json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ message: "Error fetching comments" });
    }
});

// GET all comments without any filters
router.get('/getAll', async (req, res) => {
    try {
        const comments = await commentModel.find({});
        res.json(comments);
    } catch (error) {
        console.error("Error fetching all comments:", error);
        res.status(500).json({ message: "Error fetching all comments" });
    }
});

// PUT/update comment route
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
});

// DELETE comment route
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
});

module.exports = router;
