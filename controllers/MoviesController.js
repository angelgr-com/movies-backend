const MoviesController = {};
const TMDB = require('../config/TMDB');
const { default: axios } = require('axios');
const { Movie } = require('../models/index');
const { Genre } = require('../models/index');

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

const getActors = async movie_id => {
    console.log('movie_id', movie_id);
    // https://developers.themoviedb.org/3/movies/get-movie-credits
    let results = await axios.get(`
        https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${TMDB.api_key}&language=${TMDB.language}
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
    saveActors(req.params.movie_id);
    res.send(await getActors(req.params.movie_id));
}

const saveActors = async (movie_id) => {
    let actors = await getActors(movie_id);
    console.log(actors);
    for(const [property, value] of Object.entries(actors)) {
        let actorDetails = await axios.get(` https://api.themoviedb.org/3/person/${actors.id}?api_key=${TMDB.api_key}&language=${TMDB.language}`);
        let name = actor.name;
        let birthday = actorDetails.birthday;
        let place_of_birth = actorDetails.place_of_birth;
        let biography = actorDetails.biography;
        let img = actor.profile_path;
        console.log(actor);
    }
}

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
                https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB.api_key}&language=${TMDB.language}
                `);
                res.send(results.data);
            }
        } else if (req.query.title) {
            // https://developers.themoviedb.org/3/search/search-movies
            let results = await axios.get(`
            https://api.themoviedb.org/3/search/movie?api_key=${TMDB.api_key}&query=${title}&language=${TMDB.language}&page=1&include_adult=false
            `);
            res.send(results.data);
        } else {
            res.send('Incorrect query. Please, search by title or by TMDB ID number.');
        }
    } catch (error) {
        console.log(error);
    }
}

MoviesController.getGenres = async (req, res) => {
    Genre.findAll()
    .then(() => {
        Genre.findAll()
        .then(genres => {
            if(genres != 0){
                res.send(genres);
            }else {
                res.send(`There are no movies in the database.`);
            }
        })
    })
    .catch(error => {
        res.send(error);
    });
}

MoviesController.saveMovieByID = async (req, res) => {
    // https://developers.themoviedb.org/3/movies/get-movie-details
    let results = await axios.get(`
    https://api.themoviedb.org/3/movie/${req.params.movie_id}?api_key=${TMDB.api_key}&language=${TMDB.language}`);
    
    // https://developers.themoviedb.org/3/movies/get-movie-external-ids
    let externalIDs = await axios.get(`
    https://api.themoviedb.org/3/movie/${req.params.movie_id}/external_ids?api_key=${TMDB.api_key}&`);


    Movie.findOne({
        where : { tmdb_id: req.params.movie_id }
    })
    .then(movie => {
        if(movie != null) {
            res.send('The movie is already in the database');
        } else {
            Movie.create({
                tmdb_id: req.params.movie_id,
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

// Every time saves one different page (20 movies) from TMDB's top rated movies
MoviesController.saveTopRatedMovies = async (req, res) => {
    let page = Math.floor(Math.random() * (10 - 1 + 1) + 1);
    // https://developers.themoviedb.org/3/movies/get-top-rated-movies
    let results = await axios.get(`
    https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB.api_key}&language=${TMDB.language}&page=${page}`);
    let movies = 0;
    for (let i=0;i<20;i++) {
        let tmdbID = results.data.results[i].id;
        // https://developers.themoviedb.org/3/movies/get-movie-external-ids
        let externalIDs = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbID}/external_ids?api_key=${TMDB.api_key}&`);

        // Only saves to the database if movie is not added
        Movie.findOne({
            where : { tmdb_id: tmdbID }
        }).then(movie => {
            if(movie === null) {
                movies++;
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
    movies > 0 ?
        res.send(`${movies+1} movies from TMDB's Top Rated Movies page ${page} were added.`)
    :
        res.send(`No movies from TMDB's Top Rated Movies page ${page} were added.`);
}

MoviesController.saveGenres = async (req, res) => {
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

    // Only saves in the database if Genres table is empty
    Genre.findOne({
        where : { id_tmdb : results.data.genres[0].id }
    })
    .then(genre => {
        if (genre == null) {
            saveGenres();
            res.send(`Genres added to the database.`)
        }
    })
    .catch(error => {
        res.send(error);
    });
}

module.exports = MoviesController;