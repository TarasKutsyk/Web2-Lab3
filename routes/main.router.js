const planetRouter = require('./planet.router');
const stationRouter = require('./station.router');
const cargoRouter = require('./cargo.router');
const router = require('express').Router({strict: true});

router.get('/', function (request, response) {
  response.render('pages/index', { title: 'Home' })
})
router.get('/planet', function (request, response) {
  response.render('pages/planet', { title: 'Planet' })
})
router.get('/station', function (request, response) {
  response.render('pages/station', { title: 'Station' })
})
router.get('/cargo', function (request, response) {
  response.render('pages/cargo', { title: 'Cargo' })
})

router.use('/planets', planetRouter);
router.use('/stations', stationRouter);
router.use('/cargoes', cargoRouter);

module.exports = router;
