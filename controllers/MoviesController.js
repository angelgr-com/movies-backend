const MoviesController = {};
const TMDB = require('../config/TMDB');
const { default: axios } = require('axios');
const { Movie } = require('../models/index');
let page = 1;

MoviesController.getTopRatedMovies = async (req, res) => {
	// https://developers.themoviedb.org/3/movies/get-top-rated-movies
    let results = await axios.get(`
    https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB.api_key}&language=${TMDB.language}&page=${page}`);
    page++;
    let array = [];
    for (let i=0;i<20;i++){
        let tmdbID = results.data.results[i].id;
        // https://developers.themoviedb.org/3/movies/get-movie-external-ids
        let externalIDs = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbID}/external_ids?api_key=${TMDB.api_key}&`);
        Movie.create({
            tmdb_id: tmdbID,
            imdb_id: externalIDs.data.imdb_id,
            facebook_id: externalIDs.data.facebook_id,
            instagram_id: externalIDs.data.instagram_id,
            twitter_id: externalIDs.data.twitter_id,
            popularity: results.data.results[i].popularity,
            poster_path: results.data.results[i].poster_path,
            release_date: results.data.results[i].release_date,
            title: results.data.results[i].title,
            video: results.data.results[i].video,
            vote_average: results.data.results[i].vote_average,
            vote_count: results.data.results[i].vote_count,
            id_genre: null,
            id_actor: null,
        })
        .then(movie => {
            array.push(movie);
        })
        .catch((error) => {
            res.send(error);
        });
    }
    res.send(`Top rated movies added.`);
}

MoviesController.addMovieByID = async (req, res) => {
    let tmdbID = req.params.id;
    // https://developers.themoviedb.org/3/movies/get-movie-details
    let results = await axios.get(`
    https://api.themoviedb.org/3/movie/${tmdbID}?api_key=${TMDB.api_key}&language=${TMDB.language}`);
    // https://developers.themoviedb.org/3/movies/get-movie-external-ids
    let externalIDs = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbID}/external_ids?api_key=${TMDB.api_key}&`);
    Movie.create({
        tmdb_id: tmdbID,
        imdb_id: externalIDs.data.imdb_id,
        facebook_id: externalIDs.data.facebook_id,
        instagram_id: externalIDs.data.instagram_id,
        twitter_id: externalIDs.data.twitter_id,
        popularity: results.data.popularity,
        poster_path: results.data.poster_path,
        release_date: results.data.release_date,
        title: results.data.title,
        video: results.data.video,
        vote_average: results.data.vote_average,
        vote_count: results.data.vote_count,
        id_genre: null,
        id_actor: null,
    })
    .then(movie => {
        res.send(`"${results.data.title}" movie added to the database.`);
    })
    .catch((error) => {
        res.send(error);
    });
}

MoviesController.searchByTitle = async (req, res) => {
    try {
        // https://developers.themoviedb.org/3/search/search-movies
        let results = await axios.get(`
        https://api.themoviedb.org/3/search/movie?api_key=${TMDB.api_key}&query=${req.params.title}&language=${TMDB.language}&page=1&include_adult=false`);

        res.send(results.data);
    } catch (error) {
        console.log(error);
    }
}

MoviesController.searchByID = async (req, res) => {
    let id = req.params.id;
    try {
        // https://developers.themoviedb.org/3/movies/get-movie-details
        let results = await axios.get(`
        https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB.api_key}&language=${TMDB.language}`);
        res.send(results.data);
    } catch (error) {
        console.log(error);
    }
}

MoviesController.getAllMovies = (req, res) => {
    Movie.findAll()
    .then(movies => {
        if(movies != 0){
            res.send(movies);
        }else {
            res.send(`There are no movies in the database.`);
        }
    }).catch(error => {
        res.send(error);
    });
}

module.exports = MoviesController;