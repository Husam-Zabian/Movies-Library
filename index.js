'use strict';

const express = require('express');
const cors = require('cors');
const server = express();

const axios = require('axios');
require('dotenv').config();
const pg = require('pg');

server.use(cors());

server.use(express.json());

const PORT = process.env.PORT || 3000 ;

const client = new pg.Client(process.env.DATABASE_URL);

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

// server.listen(PORT, () =>{
//     console.log(`listening on ${PORT} : I am ready`);
// })

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

//add Movie route
server.post('/addMovie', (req, res) => {
    const Movies = req.body;
    const sql = `INSERT INTO movielibrary (title, poster_Path, overview) VALUES ($1, $2, $3) RETURNING *;`
    const values = [Movies.title, Movies.poster_path, Movies.overview];

    client.query(sql, values)
        .then((data) => {
            res.send("your data was added !");
        })
        .catch(error => {
            // console.log(error);
            errorHandler(error, req, res);
        });
})

//get Movies route
server.get('/getMovies', (req, res) => {
    const sqlQuery = `SELECT * FROM movielibrary`;
    client.query(sqlQuery)
        .then((data) => {
            res.send(data.rows);
        })
        .catch((err) => {
            errorHandler(err, req, res);
        })
})



server.put('/UPDATE/:id', (req, res) => {
    const id = req.params.id;
    if (!isNaN(id)) {
        const Movies = req.body;
        const sql = `UPDATE movielibrary SET title =$1 , poster_Path =$2 , overview =$3 WHERE id = ${id} RETURNING *;`
        const values = [Movies.title, Movies.poster_path, Movies.overview];

        client.query(sql, values)
            .then((data) => {
                res.status(200).send(data.rows);
            })
            .catch(error => {
                // console.log(error);
                errorHandler(error, req, res);
            });
    }
    else {
        res.send("Id Must Be Numaric");
    }

})

//DELETE Movies
server.delete('/DELETE/:id', (req, res) => {
    const id = req.params.id;
    if (!isNaN(id)) {
        const sqlQuery = `DELETE FROM movielibrary WHERE id = ${id};`;
        client.query(sqlQuery)
            .then((data) => {
                res.status(204).json({});
            })
            .catch((err) => {
                errorHandler(err, req, res);
            })
    }
    else {
        res.send("Id Must Be Numaric");
    }


})


// //select Movies
server.get('/getMovie/:id', (req, res) => {
    const id = req.params.id;
    if (!isNaN(id)) {
        const sqlQuery = `SELECT * FROM movielibrary WHERE id = ${id};`;
        client.query(sqlQuery)
            .then((data) => {
                res.send(data.rows);
            })
            .catch((err) => {
                errorHandler(err, req, res);
            })
    }
    else {
        res.send("Id Must Be Numaric");
    }
})

server.get('*',(req,res)=>{
    res.status(404).send("page not found error");
})


client.connect()
.then(()=>{
    server.listen(PORT, () => {
        console.log(`listening on ${PORT} : I am ready`);
    });  
})