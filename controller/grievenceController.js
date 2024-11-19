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


export const getGrievances = async (req, res) => {
  try {
    const { grievanceType, status, location, sortBy, sortOrder, query } = req.query;

    // Build the filter object
    const filter = {};
    if (grievanceType) filter.grievanceType = grievanceType;
    if (status) filter.status = status;
    if (location) filter.location = { $regex: location, $options: 'i' }; // using regex for case-insensitive match

    // searching based query 
    if (query) {
      filter.$or = [
        { grievanceType: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
        { 'userId.username': { $regex: query, $options: 'i' } },
      ];
    }

    // Build the sort object
    const sort = {};
    if (sortBy) sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // fethcing
    const grievances = await Greivence.find(filter)
      .sort(sort)
      .populate({
        path: 'userId',
        select: 'username email',
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


  
  export const grivenceDashboard = async (req, res) => {
    try {
      const [resolvedCount, pendingCount, ongoingCount, typeCounts] = await Promise.all([
        Greivence.countDocuments({ status: "Resolved" }),
        Greivence.countDocuments({ status: "Pending" }),
        Greivence.countDocuments({ status: "In Progress" }),
        Greivence.aggregate([
          { $group: { _id: "$grievanceType", count: { $sum: 1 } } },
          { $project: { type: "$_id", count: 1, _id: 0 } },
        ]),
      ]);
  
      const formattedTypeCounts = typeCounts.reduce((acc, { type, count }) => {
        acc[type] = count;
        return acc;
      }, {});
  
      res.status(200).json({
        success: true,
        data: {
          resolved: resolvedCount,
          pending: pendingCount,
          ongoing: ongoingCount,
          typeCounts: formattedTypeCounts,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching dashboard data" });
    }
  };
  

export const getRecentResolvedCases = async (req,res)=> {
  try {
    const grievences = await Greivence.find({status:'Resolved'}).populate({
      path: 'userId',
      select: 'username email',
    }).limit(10)
    if(!grievences || grievences.length ===0){
      return res.status(200).json({message:"No grievences found"})
    }
    res.status(200).json({success:true,grievences})
  } catch (error) {
    res.status(500).json({success:false,message: "Errror in getting case details"})
  }
}


  
