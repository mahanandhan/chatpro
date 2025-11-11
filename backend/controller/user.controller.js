import UserModel from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from "../utils/generateToken.js";
export const signup = async (req, res) => {
    try {
        const { fullname, username, password } = req.body;
        if (!fullname || !username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }
        const existingUser = await UserModel.findOne({ username });
        if (existingUser){
            return res.status(409).json({ message: "Username already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new UserModel({
            fullname,
            username,
            password: hashedPassword
        })
        if(newUser){
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullname,
                username: newUser.username,
                password: newUser.password
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.error("Error during user signup:", error);
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username });
        if(!user || !password){
            return res.status(400).json({ message: "Username and password are required" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({ message: "Invalid credentials" });
        }
        generateTokenAndSetCookie(user._id, res);
        return  res.status(200).json({
            _id: user._id,
            fullName: user.fullname,
            username: user.username,
            password: user.password
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.error("Error during user login:", error);
    }
}

export const logout = async(req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error during logout:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMe = async (req, res) => {
    try {
        const user = req.user;
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMe:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}