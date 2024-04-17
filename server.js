import express from 'express';
import './src/config/env.config.js'
import { connectToDB } from './src/config/db.config.js';
import bodyParser from 'body-parser';
import { ApplicationError } from './src/Error-handler/applicationerror.js';
import questionRouter from './src/features/questions/question.route.js';
import mongoose from 'mongoose';

//creating server
const server= express();

//configure body parser
server.use(bodyParser.json());

//default route
server.get('/',(req,res)=>{
    res.send("Welcome to Polling API")
})

//routes
server.use('/api/poll',questionRouter);

//404 error middleware
server.use((req,res)=>{
    res.status(404).send("API not found")
})


//error handling middleware
server.use((err, req, res, next) => {
    console.log(err);
    if(err instanceof mongoose.Error.ValidationError){
        res.status(400).send(err.message);
    }
    
    if (err instanceof ApplicationError) {
        res.status(err.code).send(err.message);
    }
    //server errors.
     res.status(500).send("Something went wrong, try again later");
});


//server listening
server.listen(process.env.PORT,()=>{
    console.log("Server is running at",process.env.PORT)
    connectToDB();
})