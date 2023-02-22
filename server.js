'use strict';

const express = require('express');
const cors = require('cors');
const server = express();

server.use(cors());

const PORT = 3000;


server.get('/favorite',(req,res)=>{
    res.send("Welcome to Favorite Page");
})


server.get('*',(req,res)=>{
    res.status(404).send("page not found error");
})

server.get('*',(req,res)=>{
    res.status(500).send("Sorry, something went wrong");
})

