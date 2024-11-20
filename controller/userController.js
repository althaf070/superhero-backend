import bcrypt from 'bcryptjs';
import User from '../model/userSchema.js';
import { generateAndSetCookies } from '../utils/generateAndSetCookie.js';


// signup functiom

export const signup =async (req, res) =>{
const {username,email,password} = req.body
try {
    if (!username || !email || !password ) {
        return res.status(400).json({ success: false, message: 'Please enter all form fields' });
      }
    const existingUser = await User.findOne({email})
    if(existingUser){
        return res.status(400).json({success: false, message:"User already exists"})
    }
    // hashing password
    const hashedpassword = await bcrypt.hash(password,10)

    const newUser = new User({
        username,
        email,
        password:hashedpassword
    })
    await newUser.save()
    generateAndSetCookies(res,newUser._id)
    res.status(201).json({
        success: true,
        message: "User created successfully",
  user: {
    ...newUser._doc,  
    password: undefined,
  },
    });
    // reterned user without password
} catch (error) {
    console.log(error.message,"Error in signup");
    res.status(500).json({success:false,message:"Error in signup,Server Error"})
    
}
}

// user logn
export const login = async(req, res) => {
const {email,password} = req.body;
try {
         // Check if email and password are provided
         if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please enter all form fields' });
        }

    const user = await User.findOne({email})
    if (!user) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    const passwordValid = await bcrypt.compare(password,user.password,)
    if (!passwordValid) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    generateAndSetCookies(res,user._id)
    res.status(200).json({ success: true, message:"Login successful",user:{
        ...user._doc,
        password:undefined
    }})

} catch (error) {
    console.log("Error in login ", error);
		res.status(400).json({ success: false, message: "Error in login,server error" });
}
}

// logout
export const logout = async (req, res) => {
    try {
      res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV==="production",sameSite:"None" });
      res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Logout failed" });
    }
  };
  

//   to find a user is logged in or not
export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password")
        if(!user){
            return res.status(404).json({success: false, message:"User not found"})
        }
        res.status(200).json({success:true,message:"User is logged in",user})
    } catch (error) {
        console.log("Error in checkAuth ", error);
		res.status(500).json({ success: false, message: "Error in checking auth,server error" });
    }
}






export const getAllUsers = async(req,res)=> {
    try {
        const user = await User.find()
        if(!user || user.length == 0){
            return res.status(404).json({success: false, message:"User not found"})
        }
        res.status(200).json({success:true,message:"User found",user})
    } catch (error) {
        console.log("Error in getting user ", error);
		res.status(500).json({ success: false, message: "Error in getting user,server error" });
    }
}