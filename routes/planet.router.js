const planetsModel = require('../database/models/Planet');
const router = require('express').Router({strict: true});

router.get('/', async (req, res) => {
  try {
    const filter = req.query;

    const planets = await planetsModel.find(filter);
    res.json(planets);
  } catch (e) {
    console.log('Planets GET error: ', e.message);
    res.status(400).send();
  }
});

router.get('/:id', async (req, res) => {
  try {
    const {id} = req.params;

    const planet = await planetsModel.findById(id);
    res.json(planet);
  } catch (e) {
    console.log('Planet GET error: ', e.message);
    res.status(400).send();
  }
});

router.post('/', async (req, res) => {
  try {
    const newPlanet = req.body;

    await planetsModel.create(newPlanet);
    const planets = await planetsModel.find();

    res.json(planets);
  } catch (e) {
    console.log('Planets POST error: ', e.message);
    res.status(400).send(e.message);
  }
});

router.put('/', async (req, res) => {
  try {
    const {id, data} = req.body;

    await planetsModel.findByIdAndUpdate(id, data);

    res.send();
  } catch (e) {
    console.log('Planets PUT error: ', e.message);
    res.status(400).send(e.message);
  }
})

router.delete('/', async (req, res) => {
    const {id} = req.body;

    planetsModel.findByIdAndDelete(id, (err) => {
      if (err) {
        console.log('Planets DELETE error: ', err.message);
        res.status(400).send(err.message);
      }
      else {
        res.send();
      }
    });
})

module.exports = router;
