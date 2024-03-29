/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  // 2.GET /todos/:id - Retrieve a specific todo item by ID
  //   Description: Returns a specific todo item identified by its ID.
  //   Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
  //   Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  // 4. PUT /todos/:id - Update an existing todo item by ID
  //   Description: Updates an existing todo item identified by its ID.
  //   Request Body: JSON object representing the updated todo item.
  //   Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
  //   Example: PUT http://localhost:3000/todos/123
  //   Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
  npx jest ./tests/todoServer.test.js
 */
  const express = require('express');
  const bodyParser = require('body-parser');
  const fs = require('fs');
  const path = require('path');
  const cors = require("cors");
  const mongoose = require('mongoose')


  const todoSchema = new mongoose.Schema({
    title:{type:String},
    description:{type:String}
  });

  const Todos = mongoose.model('Todos',todoSchema);

  mongoose.connect('mongodb+srv://ruwaid:ruwaid@cluster0.mlnnycw.mongodb.net/Courses');


  
  const app = express();
  const port = 3000;
   app.use(cors());

  // let counter_id =0;
  
  // var todos = [];
  
  // app.use(bodyParser.json());
  // function loadTodos() {
  //   try {
  //     const data = fs.readFileSync('todos.json');
  //     todos = JSON.parse(data);
  //   } catch (error) {
  //     todos = [];
  //   }
  // }
  
  // // Save todos to file
  // function saveTodos() {
  //   fs.writeFileSync('todos.json', JSON.stringify(todos));
  // }

 
  
  // function getTodo(req,res){
  //    loadTodos();
  //     res.status(200).json(todos);
  // }

  // function getTodoId(req,res){
  // const foundId = todos.find(todo => todo.id===parseInt(req.params.id));
  // if(foundId){
  //    res.status(200).json(foundId);
  // }
  // else {
  //    res.status(404).send();
  // }
  
  // };
  // function generateRandomId() {
  //   const min = 1000; 
  //   const max = 9999; 
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // };
  
  // function isIdUnique(id) {
  //   return todos.every(todo => todo.id !== id);
  // };
  // function uniqueID(){
  
  //     let id = generateRandomId();
  //     while (!isIdUnique(id)) {
  //       id = generateRandomId();
  //     }
  //     return id;
  // };
  
  // function createTodo(req,res){
    
  //   const todo = {
  //     id: uniqueID(),
  //     title: req.body.title,
  //     completed:req.body.completed,
  //     description: req.body.description
  //   }
  //   todos.push(todo);
  //   saveTodos();
  //    res.status(201).json(todo);
  // }
  //   function Updateid (req,res){
  //     const foundIdindex = todos.findIndex(todo => todo.id ===parseInt(req.params.id));
  //     if(foundIdindex === -1){
  //       res.status(404).send();
  //     }
  //     else{
  //       todos[foundIdindex].title = req.body.title;
  //       todos[foundIdindex].completed = req.body.completed;
  //       todos[foundIdindex].description = req.body.description;
  //       saveTodos();
  //       res.status(200).json(todos[foundIdindex]);
        
  //     }
  
  //   }
  // function DeleteTodo(req,res){
  
  //   const index = todos.findIndex(t => t.id ===parseInt(req.params.id));
  //   if (index === -1) {
  //      res.status(404).send();
  //   } else {
  //     todos.splice(index, 1);
  //     saveTodos();
  //      res.status(200).send();
  //   }
  
  // }
  
  
  app.get('/todos/:id',async (req,res)=>{
    const todo = await Todos.findById(req.params.id);
    if(todo){
      res.status(200).json({todo});
    }
    else{
      res.status(404).json({"message":"todo not found"});
    }
  });
  app.get('/todos',async (req,res)=>{
    const todo = await Todos.find({});
    res.status(200).json(todo);
  });


  app.post('/todos',async (req,res)=>{

  
      const newtodo = {
        title: req.body.title,
        description: req.body.description
      };
    

   const todo = new Todos(newtodo);
   console.log(newtodo);
    await todo.save();
    const output = {
      message:"Todo created Successfully",
      todoId:todo._id,
      todo:todo
    }
    res.status(200).json(output);
  });

  app.put('/todos/:id',async (req,res)=>{
    const todo = await Todos.findByIdAndUpdate(req.params.id,req.body,{new:true});
    if(todo){
      const output = {
            message: "Todo updated successfully"
          }
          res.status(200).json(output);
    }
    else{
      res.status(404).json({message: 'Todo not found'});
    }
  });

  app.delete('/todos/:id',async (req,res)=>{
  const todo = await Todos.findByIdAndDelete(req.params.id,{new:true});
  if(todo){
    const output = {
          message: "Todo deleted successfully"
        }
        res.status(200).json(output);
  }
  else{
    res.status(404).json({message: 'Todo not found'});
  }

  });
  


  app.get("/",(req,res)=>{
<<<<<<< HEAD
    console.log(__dirname);
   res.sendFile(path.join(__dirname,"../frontend/index.html"));

=======
    res.sendFile(path.join(__dirname,"../frontend/index.html"));
>>>>>>> eecc437e8d3185d9beb2f398a6e33e9e09d7b38f
  })


 function handleNotFound(req, res, next) {
  res.status(404).send();
  next();
}
app.use(handleNotFound);

function started() {
  console.log(`Example app listening on port ${port}`)
}
app.listen(port, started)
  
  module.exports = app;
  