const MoviesController = {};
const TMDB = require('../config/TMDB');
const { default: axios } = require('axios');
const { Movie } = require('../models/index');
const { Genre } = require('../models/index');
let page = 1;

// Every time saves one different page (20 movies) from TMDB's top rated movies
MoviesController.saveTopRatedMovies = async (req, res) => {
    // https://developers.themoviedb.org/3/movies/get-top-rated-movies
    let results = await axios.get(`
    https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB.api_key}&language=${TMDB.language}&page=${page}`);
    page++;
    
    let array = [];
    let number = 0;
    for (let i=0;i<20;i++){
        let tmdbID = results.data.results[i].id;
        // https://developers.themoviedb.org/3/movies/get-movie-external-ids
        let externalIDs = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbID}/external_ids?api_key=${TMDB.api_key}&`);

        Movie.findOne({
            where : { tmdb_id: tmdbID }
        }).then(movie => {
            number++;
            if(movie === null) {
                Movie.create({
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
    if(number > 0)
        res.send(`${number+1} top rated movies were added.`);
    else
        res.send('No movies were added');
}

MoviesController.saveMovieByID = async (req, res) => {
    // https://developers.themoviedb.org/3/movies/get-movie-details
    let results = await axios.get(`
    https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${TMDB.api_key}&language=${TMDB.language}`);
    
    // https://developers.themoviedb.org/3/movies/get-movie-external-ids
    let externalIDs = await axios.get(`
    https://api.themoviedb.org/3/movie/${req.params.id}/external_ids?api_key=${TMDB.api_key}&`);

    Movie.findOne({
        where : { tmdb_id: req.params.id }
    })
    .then(movie => {
        if(movie != null) {
            res.send('The movie is already in the database');
        } else {
            Movie.create({
                tmdb_id: req.params.id,
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
            })
            .then(movie => {
                res.send(`"${results.data.title}" movie added to the database.`);
            })
            .catch((error) => {
                res.send(error);
            });
        }
    }).catch(error => {
        res.send(error);
    });
}

MoviesController.search = async (req, res) => {
    let id = req.query.id;
    let title = req.query.title;
    try {
        if(req.query.id) {
            // https://developers.themoviedb.org/3/movies/get-movie-details
            let results = await axios.get(`
            https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB.api_key}&language=${TMDB.language}
            `);
            res.send(results.data);
        } else if (req.query.title) {
            // https://developers.themoviedb.org/3/search/search-movies
            let results = await axios.get(`
            https://api.themoviedb.org/3/search/movie?api_key=${TMDB.api_key}&query=${title}&language=${TMDB.language}&page=1&include_adult=false
            `);
            res.send(results.data);
        } else {
            res.send('Incorrect query. Please, search by title or by TMDB movie id.');
        }
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

MoviesController.getGenres = async (req, res) => {
    let results = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB.api_key}&language=${TMDB.language}`);

    const saveGenres = () => {
        for(let i=0; i<results.data.genres.length; i++) {
            Genre.create({
                id_tmdb: results.data.genres[i].id,
                name: results.data.genres[i].name,
            })
            .catch((error) => {
                console.log(error);
            });
        }
    };
    
    Genre.findOne({
        where : { id_tmdb : results.data.genres[0].id }
    })
    .then(genre => {
        if (genre != null) {
            Genre.findAll()
            .then(() => {
                Genre.findAll()
                .then(genres => {
                    if(genres != 0){
                        res.send(genres);
                    }else {
                        // res.send(`There are no movies in the database.`);
                    }
                })
            })
            .catch(error => {
                res.send(error);
            });
        } else {
            saveGenres();
            res.send(`Genres added to the database.`)
        }
    })
    .catch(error => {
        res.send(error);
    });
}

module.exports = MoviesController;