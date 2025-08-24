import Task from "../models/task.model.js";

// Create new Task 
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;
    const task = new Task({
        title, description, priority, dueDate, 
        completed : completed === "Yes" || completed === true,
        owner : req.user.id 
    })

    const saved = await task.save();
    res.status(201).json({
      success : true,
      task : saved
    })
    
  } catch (error) {
    console.log('Error in createTask Controller',error);
        res.status(400).json({
            success : false,
            message : error.message
        })
  }
}

// get all task for logged in user
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({owner: req.user.id}).sort({createdAt: -1});
    res.json({
      success : true,
      tasks
    })
  } catch (error) {
    console.log('Error in getTasks Controller',error);
    res.status(500).json({
        success : false,
        message : error.message
    })
  }
}

// Get single task by id(must belong to that user)
export const getTaskById = async (req, res) => {
  try {
     const task = await Task.findOne({_id: req.params.id, owner: req.user.id});
     if(!task){
        return res.status(404).json({
        success : false,
        message : "Task not found"
      })
     }

     res.json({
        success: true,
        task
     })

  } catch (error) {
    console.log('Error in getTaskById Controller',error);
    res.status(500).json({
        success : false,
        message : error.message
    })
  }
}
// update a take 
export const updateTask = async (req, res) => {
    try {
      const data = { ...req.body};
      if(data.completed !== undefined){
        data.completed = data.completed === "Yes" || data.completed === true;
      }

      const update = await Task.findOneAndUpdate(
        { _id: req.params.id, 
          owner: req.user.id
        },
        data,
        { new: true, runValidators: true }
    );

    if(!update){
      return res.status(404).json({
        success : false,
        message : "Task not found"
      })
    }
    } catch (error) {
    console.log('Error in updateTask Controller',error);
    res.status(500).json({
        success : false,
        message : error.message
    })
    }
}

// Delete a taks 
export const deleteTask = async (req, res) =>{
   try {
    const deleted = await Task.findOneAndDelete({
      _id :req.params.id,
      owner: req.user.id
    });
    if(!deleted){
      return res.status(404).json({
        success : false,
        message : "Task not found"
      })
    }
    res.json({ 
      success : true,
      message : "Task deleted successfully"
    })
   } catch (error) {
    console.log('Error in deleteTask Controller',error);
    res.status(500).json({
        success : false,
        message : error.message
    }) 
   }
}