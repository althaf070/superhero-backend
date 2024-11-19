import mongoose from "mongoose";

const superHeroSchema = new mongoose.Schema({

    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
})

const Hero = mongoose.model('Hero',superHeroSchema)
export default Hero