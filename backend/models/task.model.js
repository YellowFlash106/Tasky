import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title :{
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true,
        default : ""
    }, 
    priority : {
        type : String,
        required : true,
        enum : ["Low", "Medium", "High"],
        default : "low",
    }, 
    dueDate :{
        type : Date,
        required : false
    },
    owner :{
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true,
    },
    completed:{
        type : Boolean,
        default :false
    }
},{ timestamps : true});

const Task = mongoose.model.task || mongoose.model("Task", taskSchema);

export default Task;