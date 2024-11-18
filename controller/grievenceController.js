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

// export const getAllGreivence = async(req, res) => {
//     try {
//         const grievance = await Greivence.find()
//         if(!grievence || grievence.length === 0) {
//             return res.status(200).json({success: true, message:"No greivence found"})
//         }
//         res.status(200).json({success: true, message:"Greivence has been found",grievence})
//     } catch (error) {
//         console.log(error.message,"Error in getting grievence");
//         res.status(500).json({success:false,message:"Error in getting grievence,server error"});
//     }
// }

export const getGrievances = async (req, res) => {
    try {
      // query parameters
      const { grievanceType, status, location, sortBy, sortOrder } = req.query;
  
      // Build the filter object
      const filter = {};
      if (grievanceType) filter.grievanceType = grievanceType;
      if (status) filter.status = status;
      if (location) filter.location = { $regex: location, $options: 'i' }; //using regex enables partial matches for location with case-insensitivit
  
      // Build the sort object
      const sort = {};
      if (sortBy) sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
      const grievances = await Greivence.find(filter).sort(sort).populate({
        path: 'userId',
        select: 'username email' 
      });
  
      res.status(200).json({
        success: true,
        count: grievances.length,
        data: grievances,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch grievances',
        error: error.message,
      });
    }
  };
  
  // Get grievances by user ID
  export const getGrievancesByUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const grievances = await Greivence.find({ userId });
  
  
      res.status(200).json({
        success: true,
        count: grievances.length,
        data: grievances,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch grievances for the user',
        error: error.message,
      });
    }
  };


export const grivenceDashboard = async(req,res)=> {
  try {
    const [resolvedCount,pendingCount,ongoingCount] = await Promise.all([
      Greivence.countDocuments({status:'Resolved'}),
      Greivence.countDocuments({status:'Pending'}),
      Greivence.countDocuments({status:'In Progress'})
    ])
    res.status(200).json({
      success: true,
      data:{
        resolved:resolvedCount,
        pending:pendingCount,
        ongoing:ongoingCount,
      }
    })
  } catch (error) {
    res.status(500).json({success:false,message: "Errror in getting dashboard details"})
  }

}

export const getRecentResolvedCases = async (req,res)=> {
  try {
    const grievences = await Greivence.find({status:'Resolved'}).populate('userId')
    if(!grievences || grievences.length ===0){
      return res.status(200).json({message:"No grievences found"})
    }
    retu
  } catch (error) {
    res.status(500).json({success:false,message: "Errror in getting case details"})
  }
}


  
  // Get grievances by status
  export const getGrievancesByStatus = async (req, res) => {
    try {
      const { status } = req.params;
  
      const grievances = await Grievance.find({ status });
  
      res.status(200).json({
        success: true,
        count: grievances.length,
        data: grievances,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch grievances by status',
        error: error.message,
      });
    }
  };