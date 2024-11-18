import mongoose from "mongoose";

const grievenceSchema = new mongoose.Schema({
    userId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }],
    grievanceType: {
        type: String,
        enum: ['Property Damage', 'Abuse', 'Disturbance', 'Unlawful Surveillance', 'Other'],
        required: true,
      },
      description: {
        type: String,
        required: true,
        trim: true,
      },
      location: {
        type: String,
        required: true,
        trim: true,
      },
      status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved', 'Canceled'],
        default: 'Pending',
      },
      dateSubmitted: {
        type: Date,
        default: Date.now,
      },
      dateResolved: {
        type: Date,
      },
},{timestamps:true})

const Greivence = mongoose.model('Greivence',grievenceSchema);
export default Greivence;