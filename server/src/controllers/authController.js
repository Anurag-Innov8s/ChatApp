import { generateToken } from "../lib/utils.js";
import User from "../models/userModlel.js"
import bcrypt from "bcryptjs"
export const signup = async(req,res)=>{
    const { email,fullName,password } = req.body;
    
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields carefully"
            })
        }
        if(password.length<6){
            return res.status(400).json({
                success:false,
                message:"Password length must be greaterr than 6"
            })
        }
        const user = await User.findOne({email}) 
        if(user){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const newUser = new User({
            fullName,email,password:hashedPassword
        })
        if(newUser){
            generateToken(newUser,_id,res);
            await newUser.save();
            res.status(201).json({
                success:true,
                newUser
            })
        }
    } catch (error) {
        console.log("Error while signing up",error.message);
        res.status(500).json({
            success:false,
            message:"Internal Server error"
        })
        
    }
}

export const signin = (req,res)=>{
    res.send("Sign in route")
}

export const signout = (req,res)=>{
    res.send("Sign out route")
}