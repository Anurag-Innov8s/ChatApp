import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/userModlel.js"
import bcrypt from "bcryptjs"
export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields carefully"
            })
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password length must be greaterr than 6"
            })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({
            fullName, email, password: hashedPassword
        })
        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                success: true,
                newUser
            })
        }
    } catch (error) {
        console.log("Error while signing up", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server error"
        })

    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields carefully"
            })
        }
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid Credentials."
            })
        }
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials."
            })
        }
        generateToken(user._id, res);
        res.status(200).json({
            success: true,
            user
        }) 
    } catch (error) {
        console.log("Error while logging in ", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server error"
        })
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({
            success: true,
            message: "Logged out successfully."
        })
    } catch (error) {
        console.log("Error while logging out",error.message);
        res.status(500).json({
            success:false,
            message:"Internal Server error"
        })
    }
}

export const updateProfile = async(req,res)=>{
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;
        if(!profilePic){
            return res.status(400).json({
                success:false,
                message:"Profile pic is required"
            })
        }
        await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId,{profilepic:uploadResponse.secure_url},{new:true})
        res.status(200).json({
            success:true,
            message:"User updated successfully",
            updatedUser
        })
    } catch (error) {
        console.log("Error while updating user",error.message);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
        
    }
}
export const checkAuth = (req,res)=>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth controller",error.message);
        res.status(500).json({
            success:false,
            message:"Interval serer Error."
        })
        
    }
}