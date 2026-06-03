import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In a real app, we would hash this!
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;