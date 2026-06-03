import express from "express";
import Thread from "../models/Thread.js";
import User from "../models/User.js"; // Import the User model we created
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

// --- ADDED SIGNUP ROUTE ---
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ userId: newUser._id, username: newUser.username });
    } catch (err) {
        // If it's a 11000 error, it's a duplicate email!
        if (err.code === 11000) {
            return res.status(400).json({ error: "Email already exists. Try logging in!" });
        }
        console.log("Detailed Signup Error:", err);
        res.status(500).json({ error: "Signup failed" });
    }
});
//test
router.post("/test", async(req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            userId: "testUser", // Added dummy userId for testing
            title: "Testing New Thread2"
        });

        const response = await thread.save();
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to save in DB"});
    }
});

//Get threads for a SPECIFIC user - UPDATED
router.get("/thread/:userId", async(req, res) => {
    try {
        // Only find threads belonging to this specific userId
        const threads = await Thread.find({ userId: req.params.userId }).sort({updatedAt: -1});
        res.json(threads);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

router.get("/thread/content/:threadId", async(req, res) => {
    const {threadId} = req.params;
    try {
        const thread = await Thread.findOne({threadId});
        if(!thread) {
            res.status(404).json({error: "Thread not found"});
        }
        res.json(thread.messages);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

router.delete("/thread/:threadId", async (req, res) => {
    const {threadId} = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({threadId});
        if(!deletedThread) {
            res.status(404).json({error: "Thread not found"});
        }
        res.status(200).json({success : "Thread deleted successfully"});
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to delete thread"});
    }
});

// Post chat with userId - UPDATED
router.post("/chat", async(req, res) => {
    const {threadId, message, userId} = req.body; // Added userId to destructuring

    if(!threadId || !message || !userId) { // Added userId check
        res.status(400).json({error: "missing required fields"});
    }

    try {
        let thread = await Thread.findOne({ threadId, userId });

        if(!thread) {
            thread = new Thread({
                threadId,
                userId, // Link the user to the thread
                title: message,
                messages: [{role: "user", content: message}]
            });
        } else {
            thread.messages.push({role: "user", content: message});
        }

        const assistantReply = await getOpenAIAPIResponse(message);

        thread.messages.push({role: "assistant", content: assistantReply});
        thread.updatedAt = new Date();

        await thread.save();
        res.json({reply: assistantReply});
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "something went wrong"});
    }
});

export default router;