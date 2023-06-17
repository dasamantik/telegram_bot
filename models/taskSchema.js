import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    timeframe: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    files: [String] 
  });
  
export default mongoose.model('Task',taskSchema);