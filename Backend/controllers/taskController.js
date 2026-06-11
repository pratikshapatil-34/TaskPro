import Task from "../models/taskModel.js";

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      completed
    } = req.body;

    // Safety check: Ensure the auth middleware successfully passed the user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user data missing"
      });
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || "medium", // Fallback default value if frontend skips it
      dueDate,
      completed: completed || false, // Fallback default value if frontend skips it
      
      // 2. FIX: Safely fallback to req.user.id if req.user._id doesn't exist
      owner: req.user._id || req.user.id 
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getTask = async (req,res) => {
    try{
        const tasks =await Task.find({owner:req.user.id}).sort ({createdAt: -1});
        res.json({success:true,tasks});
    }
    catch(err){
        res.status(500).json({success:false,message:err.message});
    }
}

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateTask = async (req,res)  => {
    try{
        const data ={...req.body};
        if(data.completed !== undefined){
            data.completed = data.completed === 'Yes' || data.complted ===true;
        }

        const updated = await Task.findOneAndUpdate(
            {_id:req.params.id,owner :req.user.id },
            data,
            {returnDocument: 'after' , runValidators :true}
        );
        if(!updated){
            res.status(400).json({success:false,message:"Task not found or not yours"});
            res.json({success:true , task:updated});
        }
    }catch(err){
       res.status(500).json({success:false,message:err.message});
    }
}

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
    
