import Greivence from "../model/grievenceSchema.js";


export const logGrievence = async(req,res)=> {
    const {grievanceType,description,location} = req.body
    try {
        const newLog = new Greivence({
            userId:req.userId,
            grievanceType,
            location,
            description,
        })
        await newLog.save()


        res.status(201).json({success:true,message:"Grievence submitted successfully",grievence:newLog})
    } catch (error) {
        console.log(error.message,"Error in logging grievence");
        res.status(500).json({success:false,message:"Error in logging grievence,server error"});
    }
}

export const updateGrievanceStatus = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    try {
        let grievance = await Greivence.findById(id);

        if (!grievance) {
            return res.status(404).json({ success: false, message: "No grievance found with this ID" });
        }

        grievance.status = status;

        if (status === 'Resolved') {
            grievance.dateResolved = Date.now();
        }

        await grievance.save();

        res.status(200).json({ success: true, message: "Update successful", grievance });
    } catch (error) {
        console.error(error.message, "Error updating grievance status");
        res.status(500).json({ success: false, message: "Error updating grievance, server error" });
    }
};

export const userGrievece = async (req, res) => {
    const userId = req.userId;

    try {
        const grievence = await Greivence.find({userId})
        if(!grievence || grievence.length === 0) {
            return res.status(200).json({success: true, message:"You haven't added any greivence"})
        }
        res.status(200).json({success: true, message:"Greivence has been found",grievence})
    } catch (error) {
        console.log(error.message,"Error in getting user grievence");
        res.status(500).json({success:false,message:"Error in getting user grievence,server error"});
    }
}

export const getAllGreivence = async(req, res) => {
    try {
        const grievance = await Greivence.find()
        if(!grievence || grievence.length === 0) {
            return res.status(200).json({success: true, message:"No greivence found"})
        }
        res.status(200).json({success: true, message:"Greivence has been found",grievence})
    } catch (error) {
        console.log(error.message,"Error in getting grievence");
        res.status(500).json({success:false,message:"Error in getting grievence,server error"});
    }
}