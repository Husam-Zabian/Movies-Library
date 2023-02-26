'use strict';

const express = require('express');
const cors = require('cors');
const server = express();

server.use(cors());

const PORT = 3000;

server.get('/trending', testTrending);
server.get('/search', testSearch)


// function Movielibrary(title,poster_path,overview){
//     this.title = title;
//     this.poster_path = poster_path
//     this.overview = overview
// }

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

// server.get('*',(req,res)=>{
//     res.status(500).send("Sorry, something went wrong");
// })

server.listen(PORT, () =>{
    console.log(`listening on ${PORT} : I am ready`);
})



function testTrending(req, res) {


try{
    const APIKey = process.env.APIKey;

console.log(APIKey)

const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${APIKey}`


axios.get(url)

 .then((result) => {
    //code depends on axios result
    console.log("axios result");

    let mapResult = result.data.trending.map((item) => {
        let singleRecipe = new Recipe(item.id, item.title, item.release_date, item.poster_path,item.overview);
        return singleRecipe;
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


function testSearch(req, res) {


    try{
    
    console.log(APIKey)
    
    const url = `https://api.themoviedb.org/3/search/company?apiKey=${APIKey}&page=1`;
    
    
    axios.get(url)
    
     .then((result) => {
        //code depends on axios result
        console.log("axios result");
     return result
       
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


