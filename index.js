const express = require('express');
const cors = require('cors');  
// const {MongoClient}=require('mongodb');
const mongoose=require('mongoose');
// const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());  // Parse incoming JSON requests
app.use(cors());  // Enable Cross-Origin Resource Sharing

// // Database connection (optional, if using MongoDB)
const connectToDb=async()=>{
  try{
   mongoose.connect(process.env.MONGO_URI,{
      useNewUrlParser:true,
      useUnifiedTopology:true,
   })
   .then(()=>{console.log("successfully connected to db")})
   .catch((err)=>{console.log("not connected to db",err)});
  }
  catch(err){
      console.log(err);
  }
}
connectToDb();
// Sample route
const projectModel=require('./models/projectModel'); //call model after connection to db
// get all workouts
app.get('/',(req,res)=>{
    res.json({"msg":"listening dont worry working"})
})
app.get('/projects/',async(req,res)=>{
    const resp=await projectModel.find();
    res.json({"projects":resp});
});
// get a workout
app.get('/project/:id',async(req,res)=>{
    if(mongoose.Types.ObjectId.isValid(req.params.id)){ 
        const projectId=req.params.id;
        const response=await projectModel.findOne({_id:new mongoose.Types.ObjectId(projectId)});
        if(response){ // if not null
            res.json(response);
        }
        else{
            res.json({msg:"not exist workout with that name"});
        } 
    }
    else{
        res.json({"error":"unknown object"})
    }
  }
)
// Creating a project with a name and unique ID
app.post('/project/create', async (req, res) => {
  const { name } = req.body;
  console.log(name);
  if (!name) {
    return res.status(400).json({ error: "Project name is required" });
  }

  const newProject = new projectModel({
    // id: uuidv4(), // Assign a custom unique ID
    name,
    details: {
      toDo: [],
      inProgress: [],
      inReview: [],
      completed: []
    }
  });

  try {
    await newProject.save();
    console.log("new project saved successfully");
    res.status(201).json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    res.status(500).json({ error: "Failed to create project", details: error.message });
  }
});

app.post('/project/:id/tasks', async (req, res) => {
    const { id } = req.params;
    const { tasks, category } = req.body; // tasks should be an array of task objects
  console.log(req.body,id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }
  
    if (!tasks) {
      return res.status(400).json({ error: "Tasks is non-empty " });
    }
  
    if (!['toDo', 'inProgress', 'inReview', 'completed'].includes(category)) {
      return res.status(400).json({ error: "Invalid category. Must be one of toDo, inProgress, inReview, completed" });
    }
  
    try {
      const project = await projectModel.findById(id);
  
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
  
      // Append tasks to the specified category
      project.details[category].push (tasks);
      console.log("projectadded");
      await project.save();
      res.status(200).json({ message: "Tasks added successfully", project });
    } catch (error) {
      res.status(500).json({ error: "Failed to add tasks", details: error.message });
    }
  });
  
// app.post('/project/',async(req,res)=>{
//     console.log(req.body);
//     const newProjectModel=new projectModel(req.body);
//     await newProjectModel.save(); // save the new workout
//     res.json({"msg":"created","res":newProjectModel});
// })
// response= await workoutModel.create(req.body); //another way of creating a new workout
// delete a workout
app.delete('/project/:id',async(req,res)=>{
    console.log(req.params.id);
    if(! mongoose.Types.ObjectId.isValid(req.params.id)) return res.json({"error":"not valid id"});
    if(! await projectModel.findById(req.params.id))return res.json({"error":"no one present with that id"});
    await projectModel.deleteOne({_id:new mongoose.Types.ObjectId(req.params.id)});
    //await workoutModel.findByIdAndDelete(req.params.id);
    res.json({"msg":"deleted"})
});
// update wotkout 
app.patch('/project/:id',async(req,res)=>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({"msg":"not valid id"});
    const project=await projectModel.findById(req.params.id);
    if(!project) return res.status(400).json({"msg":"there is no such workout"});
    const {title,loads,reps}=req.body;
    workout.title = title || workout.title ;
    workout.loads =loads || workout.loads;
    workout.reps =reps || workout.reps;
    await workout.save();
    res.status(200).json({"msg":"updated workout",workout:workout});
})

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
