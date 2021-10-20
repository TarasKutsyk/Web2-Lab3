const stationsModel = require('../database/models/Station');
const planetsModel = require('../database/models/Planet');
const router = require('express').Router({strict: true});

function doesPlanetExist(name) {
  return planetsModel.exists({name});
}

router.get('/', async (req, res) => {
  try {
    const filter = req.query;

    const stations = await stationsModel.find(filter);
    res.json(stations);
  } catch (e) {
    console.log('stations GET error: ', e.message);
    res.status(400).send();
  }
});

router.get('/:id', async (req, res) => {
  try {
    const {id} = req.params;

    const station = await stationsModel.findById(id);
    res.json(station);
  } catch (e) {
    console.log('station GET error: ', e.message);
    res.status(400).send();
  }
});

router.post('/', async (req, res) => {
  try {
    const newStation = req.body;

    if (newStation.planetLocation) {
      const isPlanetValid = await doesPlanetExist(newStation.planetLocation);
      if (!isPlanetValid) {
        return res.status(400).send('Planet with such name does not exist!');
      }
    }

    await stationsModel.create(newStation);
    const stations = await stationsModel.find();

    res.json(stations);
  } catch (e) {
    console.log('stations POST error: ', e.message);
    res.status(400).send(e.message);
  }
});

router.put('/', async (req, res) => {
  try {
    const {id, data} = req.body;

    if (data.planetLocation) {
      const isPlanetValid = await doesPlanetExist(data.planetLocation);
      if (!isPlanetValid) {
        return res.status(400).send('Planet with such name does not exist!');
      }
    }

    await stationsModel.findByIdAndUpdate(id, data);

    res.send();
  } catch (e) {
    console.log('stations PUT error: ', e.message);
    res.status(400).send(e.message);
  }
})

router.delete('/', async (req, res) => {
  const {id} = req.body;

  stationsModel.findByIdAndDelete(id, (err) => {
    if (err) {
      console.log('stations DELETE error: ', err.message);
      res.status(400).send(err.message);
    }
    else {
      res.send();
    }
  });
})

module.exports = router;
