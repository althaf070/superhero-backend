import { generateAndSetHeroCookies } from "../utils/generateHeroccokie.js";
import { verifyHero } from '../middleware/verifyhero.js'
import Hero from "../model/superheoScema.js";

// login
export const heroLogin = async(req,res)=> {
    const {email,password} = req.body
try {
    if(!email || !password) {
        return new Error('Please enter all form fields')
    }
    const user = await Hero.findOne({email})
    if (!user) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
   
    generateAndSetHeroCookies(res,user._id)
    await user.save()
    res.status(200).json({ success: true, message:"Login successful",user:{
        ...user._doc,
        password:undefined
    }})

} catch (error) {
    console.log("Error in login ", error);
    res.status(500).json({ success: false, message: "Error in login,server error" });
}
}

// checking if logged in or not
export const heroCheckAuth = async(req,res)=> {
   
    try {
        const user = await Hero.findById(req.heroId).select("-password")
        if(!user){
            return res.status(404).json({success: false, message:"hero not found"})
        }
        res.status(200).json({success:true,message:"Hero is logged in",user})
    } catch (error) {
        console.log("Error in checkAuth ", error);
        res.status(500).json({ success: false, message: "Error in checking auth,server error" });
    }
}

// logout
export const heroLogout = (req, res) => {
    try {
        res.clearCookie("herotoken", { httpOnly: true, secure: process.env.NODE_ENV==="production",sameSite:"None" });
        res.status(200).json({ success: true, message: "Logout successful" });
      } catch (error) {
        res.status(500).json({ success: false, message: "Logout failed" });
      }
}