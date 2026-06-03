import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import User from "./models/User.js";

const app = express();
// This is the ONLY change: it allows Render to give your app a port automatically
const PORT = process.env.PORT || 8080;

// htis will parse our api reqests
//  these are the middle wares tha will be used when we call our backend apis fro the frontend
app.use(express.json());
app.use(cors());


// --- GET User Details ---
app.get("/api/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching user" });
  }
});

// --- NEW: Login Route ---
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    // Note: In a real app, use bcrypt.compare here!
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json({ 
      userId: user._id, 
      username: user.username, 
      email: user.email 
    });
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
});

app.use("/api", chatRoutes);


const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("CONNECTED WITH DATABASE");

        app.listen(PORT, () => {
    console.log( `server listening to port ${PORT}`)
    //  this function will be called every time when our server starts that is connecting to our data base
});

    }catch(err){
        console.log("failed to connect with db ",err);
    }
};
    connectDB(); 







//   all of this we have shifted to a different file -> openai.js
// app.post("/test", async(req , res) => {
//     const options = {
//         method: "POST",
//         headers:{
//            "Content-Type": "application/json" ,// this is taken fro open ai -> chat component
//             "Authorization":`Bearer ${process.env.OPENAI_API_KEY}` 
//         },
//         body: JSON.stringify({ // now here we will pass the required parameteres
//             model: "gpt-4o-mini",
//             messages:[{
//                 role:"user",
//                 content: req.body.message
//             }]
//         })
//     };

//     try{
//         // this will take THE fetched data and save it in the reponse from the fetch api
//         const response = await fetch("https://api.openai.com/v1/chat/completions" , options);
//         //  here we are saving it in json format
//         const data = await response.json();
//         // console.log(data);
//         res.send(data.choices[0].message.content);
//     }catch(err){
//         console.log(err);
//     }
// });