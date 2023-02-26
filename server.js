'use strict';

const express = require('express');
const cors = require('cors');
const server = express();

server.use(cors());

const PORT = 3000;

function Movielibrary(title,poster_path,overview){
    this.title = title;
    this.poster_path = poster_path
    this.overview = overview
}

server.get('/',(req,res)=>{
    const MovieData = require('./Movie Data/data.json')
    const movies = new Movielibrary(MovieData.title,MovieData.poster_path,MovieData.overview)
    res.send(movies);
})

server.get('/favorite',(req,res)=>{
    let test ="Welcome to Favorite Page"
    res.send(test);
})


server.get('*',(req,res)=>{
    res.status(404).send("page not found error");
})

server.get('*',(req,res)=>{
    res.status(500).send("Sorry, something went wrong");
})

server.listen(PORT, () =>{
    console.log(`listening on ${PORT} : I am ready`);
})


