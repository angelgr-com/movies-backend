const express = require('express');
const router = express.Router();
const MoviesController = require('../controllers/MoviesController');

router.get('/', MoviesController.getAllMovies);

// http://localhost:5000/movies/add/
router.get('/add', MoviesController.saveTopRatedMovies);

// http://localhost:5000/movies/add/619264
router.get('/add/:id', MoviesController.saveMovieByID);

// http://localhost:5000/movies/search?id="619264"&title="the king's man"
router.get('/search', MoviesController.search);

// router.get('/filter/genre', MoviesController.filterByGenre);
// router.get('/filter/actors', MoviesController.filterByActors);

module.exports = router;