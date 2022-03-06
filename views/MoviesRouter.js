const express = require('express');
const router = express.Router();
const MoviesController = require('../controllers/MoviesController');

// GET ENDPOINTS
// http://localhost:5000/movies/
router.get('/', MoviesController.getAllMovies);
// http://localhost:5000/movies/search?id="619264"&title="the king's man"
router.get('/search', MoviesController.search);
// http://localhost:5000/movies/genres/
router.get('/genres', MoviesController.getGenres);
// http://localhost:5000/movies/actors/
router.get('/actors/:movie_id', MoviesController.getActors);

// POST ENDPOINTS
// http://localhost:5000/movies/add/619264
router.post('/add/:movie_id', MoviesController.saveMovieByID);
// http://localhost:5000/movies/add/
router.post('/add', MoviesController.saveTopRatedMovies);
// http://localhost:5000/movies/genres/
router.post('/genres', MoviesController.saveGenres);

// router.get('/filter/genre', MoviesController.filterByGenre);
// router.get('/filter/actors', MoviesController.filterByActors);

module.exports = router;