const express = require('express');
const router = express.Router();
const MoviesController = require('../controllers/MoviesController');

// GET ENDPOINTS
// http://localhost:5000/movies/search?id=619264&title="the king's man"
router.get('/search', MoviesController.search);
// http://localhost:5000/movies/actors/
router.get('/actors/:tmdb_id', MoviesController.getActors);
// http://localhost:5000/movies/genres/
router.get('/genres', MoviesController.getGenres);
// http://localhost:5000/movies/
router.get('/', MoviesController.getAllMovies);
// http://localhost:5000/movies/add/619264
router.get('/add/:tmdb_id', MoviesController.saveMovieByID);

// POST ENDPOINTS
// http://localhost:5000/movies/add/
router.post('/add', MoviesController.saveTopRatedMovies);

// DELETE ENDPOINTS
// http://localhost:5000/movies/delete/619264
router.delete('/delete/:tmdb_id', MoviesController.deleteMovieByID);

module.exports = router;