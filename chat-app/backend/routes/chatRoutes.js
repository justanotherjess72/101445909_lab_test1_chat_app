const express = require("express");
const GroupMessage = require("../models/GroupMessage");
const PrivateMessage = require("../models/PrivateMessage");

const router = express.Router();

// Get group chat messages 
router.get("/group/:room", async (req, res) => {
    try {
        const messages = await GroupMessage.find({ room: req.params.room });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving group messages" });
    }
});

// Post a new group chat message 
router.post("/group", async (req, res) => {
    const { from_user, room, message } = req.body;

    if (!from_user || !room || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newMessage = new GroupMessage({ from_user, room, message });
        await newMessage.save();
        res.status(201).json({ message: "Message saved" });
    } catch (error) {
        res.status(500).json({ error: "Error saving message" });
    }
});

// Post a private message
router.post("/private", async (req, res) => {
    const { from_user, to_user, message } = req.body;

    if (!from_user || !to_user || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newMessage = new PrivateMessage({ from_user, to_user, message });
        await newMessage.save();
        res.status(201).json({ message: "Private message sent" });
    } catch (error) {
        res.status(500).json({ error: "Error sending private message" });
    }
});

// Get private messages between two users 
router.get("/private/:from/:to", async (req, res) => {
    try {
        const messages = await PrivateMessage.find({
            $or: [
                { from_user: req.params.from, to_user: req.params.to },
                { from_user: req.params.to, to_user: req.params.from }
            ]
        }).sort({ date_sent: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving private messages" });
    }
});

module.exports = router;