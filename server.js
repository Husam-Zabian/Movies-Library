'use strict';

const express = require('express');
const cors = require('cors');
const server = express();

const axios = require('axios');
require('dotenv').config();


server.use(cors());



const PORT = 3000;

server.get('/trending', testTrending);
server.get('/search', testSearch);
server.get('/upcoming', testUpcoming);



function Movielibrary(id,title,poster_path,overview,){
    this.id = id
    this.title = title;
    this.poster_path = poster_path
    this.overview = overview
}

server.get('/',(req,res)=>{
    const MovieData = require('./Movie Data/data.json')
    const movies = new Movielibrary(MovieData.title,MovieData.poster_path,MovieData.overview)
    res.send(movies);
})

// server.get('/favorite',(req,res)=>{
//     let test ="Welcome to Favorite Page"
//     res.send(test);
// })




// server.get('*',(req,res)=>{
//     res.status(500).send("Sorry, something went wrong");
// })

server.listen(PORT, () =>{
    console.log(`listening on ${PORT} : I am ready`);
})

//Trending

function testTrending(req, res) {


try{
   
    const APIKey = process.env.APIKey;

console.log(APIKey);

const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${APIKey}`


axios.get(url)

.then((result) => {
    let mapResult = result.data.results.map((movieData) => {
        let singleMovie = new Movielibrary(movieData.id,movieData.title, movieData.poster_path, movieData.overview);
        return singleMovie;
    })
    res.send(mapResult);
})
.catch((err) => {
    console.log("sorry", err);
    res.status(500).send(err);
})

}
catch (error) {
    errorHandler(error,req,res);
}

}

//search

 function testSearch(req, res) {
    
    try {
        const APIKey = process.env.APIKey;
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&query=The&page=2`;
        axios.get(url)
            .then((result) => {
                let mapResult = result.data.results.map((movieData) => {
                    let singleMovie = new Movielibrary(movieData.id,movieData.title, movieData.poster_path, movieData.overview,);
                    return singleMovie;
                })
                res.send(mapResult);
            })
            .catch((err) => {
                console.log("sorry", err);
                res.status(500).send(err);
            })
    }
    catch (error) {
        errorHandler(error,req,res);
    }
}


// now_playing
server.get('/now_playing',(req, res) => {
    try {
       
        const APIKey = process.env.APIKey;
        const url =  `https://api.themoviedb.org/3/movie/now_playing?api_key=${APIKey}&language=en-US&page=1`;
        axios.get(url)
            .then((result) => {
                let mapResult = result.data.results.map((movieData) => {
                    let singleMovie = new Movielibrary(movieData.id,movieData.title, movieData.poster_path, movieData.overview);
                    return singleMovie;
                })
                res.send(mapResult);
            })
            .catch((err) => {
                console.log("sorry", err);
                res.status(500).send(err);
            })
    }
    catch (error) {
        errorHandler(error,req,res);
    }
  
})


// upcoming
function testUpcoming(req, res)  {
    try {
        const APIKey = process.env.APIKey;
        const url =  `https://api.themoviedb.org/3/movie/upcoming?api_key=${APIKey}&page=1`;
        axios.get(url)
            .then((result) => {
                let mapResult = result.data.results.map((movieData) => {
                    let singleMovie = new Movielibrary(movieData.id,movieData.title,movieData.poster_path, movieData.overview,);
                    return singleMovie;
                })
                res.send(mapResult);
            })
            .catch((err) => {
                console.log("sorry", err);
                res.status(500).send(err);
            })
    }
    catch (error) {
        errorHandler(error,req,res);
    }
  
}

server.get('*',(req,res)=>{
    res.status(404).send("page not found error");
})