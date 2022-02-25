const express = require('express');
const router = express.Router();
const MoviesController = require('../controllers/MoviesController');

router.get('/tmdb/getTopRatedMovies', MoviesController.getTopRatedMovies);
router.get('/tmdb/addMovieByID/:id', MoviesController.addMovieByID);
router.get('/search/title/:title', MoviesController.searchByTitle);
router.get('/search/id/:id', MoviesController.searchByID);
router.get('/', MoviesController.getAllMovies);
// router.get('/filter/genre', MoviesController.filterByGenre);
// router.get('/filter/actors', MoviesController.filterByActors);

module.exports = router;