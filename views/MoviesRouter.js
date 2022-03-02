const express = require('express');
const router = express.Router();
const MoviesController = require('../controllers/MoviesController');

router.get('/', MoviesController.getAllMovies);
router.get('/add', MoviesController.saveTopRatedMovies);
router.get('/add/:id', MoviesController.saveMovieByID);
router.get('/search/id/:id', MoviesController.searchByID);
router.get('/search/title/:title', MoviesController.searchByTitle);
// router.get('/filter/genre', MoviesController.filterByGenre);
// router.get('/filter/actors', MoviesController.filterByActors);

module.exports = router;