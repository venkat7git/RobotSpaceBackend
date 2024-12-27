const express = require("express");
const dbTask = require('./user/taskConnection')
const cors = require("cors")
const {v4:uuidv4} = require("uuid")
const userController = require("./auth/userControll");
const { compare } = require("bcrypt");



const app = express()

app.use(express.json())
app.use(cors())


app.post("/signUp",userController.signUp)
app.post("/login",userController.login)


app.get("/tasks",async (req,res)=>{
    try{

        const alltasks = await dbTask.find().toArray()
        if(!alltasks) res.status(400).send("Task not found")
        res.send(alltasks)
       
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
})


app.get("/tasks/filter/:Status",async (req,res)=>{
    const {Status} = req.params
    try{

        const alltasks = await dbTask.find({Status}).toArray()
        if(!alltasks) res.status(400).send("Task not found")
        res.send(alltasks)
       
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
})


app.get("/tasks/search/:searchInput",async (req,res)=>{
    const {searchInput} = req.params
    
    try{
        await dbTask.createIndex({ TaskName: "text", Description: "text" });
        const alltasks = await dbTask.find({$text:{$search:searchInput}}).toArray()
        if(!alltasks) res.status(400).send("Task not found")
        res.send(alltasks)
       
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error"+err);
    }
})


app.put("/update/status/:id", async (req, res) => {
    const {id} = req.params;
    const { Status } = req.body;
    
    try {
        const updatedTask = await dbTask.updateMany(
            {id},
            { $set: { Status } },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).send("Task not found");
        }

        res.send("Updated successfully");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});



app.put("/update/task/:id", async (req, res) => {
    const {id} = req.params;
    const {TaskName,Description,DueDate,Status,Priority} = req.body;
    
    
    
    try {
        const updatedTask = await dbTask.updateMany(
            {id},
            { $set: {TaskName,Description,DueDate,Status,Priority}},
            { new: true }
        );

        if (!updatedTask.acknowledged) {
            return res.status(404).send("Task not found");
        }

        res.send("Updated successfully");
    } catch (err) {
        // console.error(err.message);
        res.status(500).send("Server error");
    }
});



app.delete("/tasks/delete/:id", async (req, res) => {
    const {id} = req.params;

    
    try {
        const deleteTask = await dbTask.deleteMany({id});

        if (!deleteTask.acknowledged) {
            return res.status(404).send("Task not found");
        }

        res.send("Deleted successfully");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.post("/task/post", async (req, res) => {
    const {id,TaskName,Description,DueDate,Status,Priority} = req.body
    
    
    try {
        const updatedTask = await dbTask.insertOne({id,TaskName,Description,DueDate,Status,Priority});

        if (!updatedTask.acknowledged) {
            return res.status(404).send("Task not found");
        }

        res.send("Inserted successfully");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


app.listen(3007,(err)=>{
 if(err) console.log(err);
 console.log("Server listening at port:3007");
})