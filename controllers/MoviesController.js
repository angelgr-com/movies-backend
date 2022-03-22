const dotenv = require("dotenv");
dotenv.config();
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const MoviesController = {};
const { default: axios } = require('axios');
const { Movie } = require('../models/index');
const { Genre } = require('../models/index');
const { v4: uuidv4 } = require('uuid');
let language = 'en-us';

MoviesController.search = async (req, res) => {
  let id = req.query.id;
  let title = req.query.title;
  try {
      if(req.query.id) {
          if(isNaN(parseInt(req.query.id))) {
              res.send('Incorrect ID. Check your TMDB ID number.');
          } else {
              // https://developers.themoviedb.org/3/movies/get-movie-details
              let results = await axios.get(`
              https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=${language}
              `);
              res.send(results.data);
          }
      } else if (req.query.title) {
          // https://developers.themoviedb.org/3/search/search-movies
          let results = await axios.get(`
          https://api.themoviedb.org/3/search/movie?TMDB_API_KEY=${TMDB_API_KEY}&query=${title}&language=${language}&page=1&include_adult=false
          `);
          res.send(results.data);
      } else {
          res.send('Incorrect query. Please, search by title or by TMDB ID number.');
      }
  } catch (error) {
      console.log(error);
  }
}

const getActors = async tmdb_id => {
  // https://developers.themoviedb.org/3/movies/get-movie-credits
  let results = await axios.get(`
      https://api.themoviedb.org/3/movie/${tmdb_id}/credits?api_key=${TMDB_API_KEY}&language=${language}
  `);
  let actors = results.data.cast;   
  for (let i=actors.length-1; i>=0; i--) {
    // Delete actors with popularity less than 10
    if (actors[i].popularity < 10.0) {
        actors.splice(i,1);
    }
  }
  return actors;
};
MoviesController.getActors = async (req, res) => {
    res.send(await getActors(req.params.tmdb_id));
}

MoviesController.getGenres = async (req, res) => {
  let results = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=${language}`);
  let genres = [];
  let genre = {};

  for(let i=0; i<results.data.genres.length; i++) {
    genre = {}
    genre.id_tmdb = results.data.genres[i].id; 
    genre.name = results.data.genres[i].name;
    genres.push(genre); 
  }
  
  res.status(200).send(genres);
}

MoviesController.getAllMovies = (req, res) => {
  Movie.findAll()
  .then(movies => {
    if(movies != 0){
        res.send(movies);
    }else {
        res.send(`There are no movies in the database.`);
    }
  })
  .catch(error => {
      res.send(error);
  });
}

MoviesController.saveMovieByID = async (req, res) => {
  // https://developers.themoviedb.org/3/movies/get-movie-details
  let results = await axios.get(`
  https://api.themoviedb.org/3/movie/${req.params.tmdb_id}?api_key=${TMDB_API_KEY}&language=${language}`);
  
  // https://developers.themoviedb.org/3/movies/get-movie-external-ids
  let externalIDs = await axios.get(`
  https://api.themoviedb.org/3/movie/${req.params.tmdb_id}/external_ids?api_key=${TMDB_API_KEY}&`);


  Movie.findOne({
      where : { tmdb_id: req.params.tmdb_id }
  })
  .then(movie => {
    if(movie != null) {
      res.send('The movie is already in the database');
    } 
    else {
      Movie.create({
        id: uuidv4(),
        tmdb_id: req.params.tmdb_id,
        title: results.data.title,
        // price = random price bebtwwen 0.50 and 1
        price: Math.floor(Math.random() * (100 - 50) + 50) / 100,
      })
      .then(movie => {
          res.send(`"${results.data.title}" was added to the database.`);
      })
      .catch((error) => {
          res.send(error);
      });
    }
  }).catch(error => {
      res.send(error);
  });
}

// Every time saves one different page (20 movies) from TMDB's top rated movies
MoviesController.saveTopRatedMovies = async (req, res) => {
  let page = Math.floor(Math.random() * (10 - 1 + 1) + 1);
  // https://developers.themoviedb.org/3/movies/get-top-rated-movies
  let results = await axios.get(`
  https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=${language}&page=${page}`);
  let movies = 0;
  for (let i=0;i<20;i++) {
      let tmdbID = results.data.results[i].id;
      // https://developers.themoviedb.org/3/movies/get-movie-external-ids
      let externalIDs = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbID}/external_ids?api_key=${TMDB_API_KEY}&`);

      // Only saves to the database if movie is not added
      Movie.findOne({
          where : { tmdb_id: tmdbID }
      }).then(movie => {
          if(movie === null) {
              movies++;
              Movie.create({
                  id: uuidv4(),
                  title: results.data.results[i].title,
                  tmdb_id: tmdbID,
                  imdb_id: externalIDs.data.imdb_id,
                  facebook_id: externalIDs.data.facebook_id,
                  instagram_id: externalIDs.data.instagram_id,
                  twitter_id: externalIDs.data.twitter_id,
                  popularity: results.data.results[i].popularity,
                  poster_path: results.data.results[i].poster_path,
                  release_date: results.data.results[i].release_date,
                  video: results.data.results[i].video,
                  vote_average: results.data.results[i].vote_average,
                  vote_count: results.data.results[i].vote_count,
              });
          }
      }).catch(error => {
          res.send(error);
      });
  }
  movies > 0 ?
      res.send(`${movies+1} movies from TMDB's Top Rated Movies page ${page} were added.`)
  :
      res.send(`No movies from TMDB's Top Rated Movies page ${page} were added.`);
}

MoviesController.deleteMovieByID = (req, res) => {
  try {
      Movie.destroy({
          where : { tmdb_id : req.params.tmdb_id }
      })
      .then(removedMovie => {
          res.send(`Movie "${req.params.tmdb_id}" has been removed.`);
      });
  } catch (error) {
      res.send(error);
  }
};

module.exports = MoviesController;