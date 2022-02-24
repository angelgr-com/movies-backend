const MoviesController = {};
const TMDB = require('../config/TMDB');
const { default: axios } = require('axios');
const { Movie } = require('../models/index');

MoviesController.getTopRatedMovies = async (req, res) => {

    let results = await axios.get(`
    https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB.api_key}&language=en-US&page=1`);

    // https://sequelize.org/master/manual/model-querying-basics.html
    // Model.bulkCreate
    for(let i=0;i<20;i++){
        Movie.create({
            overview: results.data.results[i].overview,
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
            res.send(`New movie created: ${movie.title}.`);
        })
        .catch((error) => {
            res.send(error);
        });
    }
    // Movie.create({
    //     overview: results.data.results[1].overview,
    //     popularity: results.data.results[1].popularity,
    //     poster_path: results.data.results[1].poster_path,
    //     release_date: results.data.results[1].release_date,
    //     title: results.data.results[1].title,
    //     video: results.data.results[1].video,
    //     vote_average: results.data.results[1].vote_average,
    //     vote_count: results.data.results[1].vote_count,
    //     id_genre: null,
    //     id_actor: null,
    // })
    // .then(movie => {
    //     res.send(`New movie created: ${movie.title}.`);
    // })
    // .catch((error) => {
    //     res.send(error);
    // });
}

module.exports = MoviesController;