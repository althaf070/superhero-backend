import express from 'express'
import Hero from '../model/superheoScema.js'
import { generateAndSetCookies } from '../utils/generateAndSetCookie.js'
import {verifyUser} from '../middleware/verifyuser.js'

const router = express.Router()
router.post('/hero-login',async(req,res)=> {
    const {email,password} = req.body
try {
    if(!email || !password) {
        return new Error('Please enter all form fields')
    }
    const user = await Hero.findOne({email})
    if (!user) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
   
    generateAndSetCookies(res,user._id)
    await user.save()
    res.status(200).json({ success: true, message:"Login successful",user:{
        ...user._doc,
        password:undefined
    }})

} catch (error) {
    console.log("Error in login ", error);
    res.status(500).json({ success: false, message: "Error in login,server error" });
}
})

router.get('/check-hero',verifyUser,async(req,res)=> {
   
        try {
            const user = await Hero.findById(req.userId).select("-password")
            if(!user){
                return res.status(404).json({success: false, message:"hero not found"})
            }
            res.status(200).json({success:true,message:"Hero is logged in",user})
        } catch (error) {
            console.log("Error in checkAuth ", error);
            res.status(500).json({ success: false, message: "Error in checking auth,server error" });
        }
})

export default router