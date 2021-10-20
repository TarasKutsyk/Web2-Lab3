const stationsModel = require('../database/models/Station');
const planetsModel = require('../database/models/Planet');
const cargosModel = require('../database/models/Cargo');
const router = require('express').Router({strict: true});

async function validatePlanet(name, updateId) {
  let planet = await planetsModel.find({name});
  if (!planet.length) {
    throw new Error('Planet with such name does not exist');
  }
  planet = planet[0];

  const countFilter = updateId ? {planetDestination: name, _id: {$ne: updateId}} : {planetDestination: name}
  const planetCargoesCount = await cargosModel.countDocuments(countFilter);
  if (planetCargoesCount >= planet.storage) {
    throw new Error('Planet cannot store any more cargoes');
  }
}

async function validateStation(number, updateId) {
  let station = await stationsModel.find({number});
  if (!station.length) {
    throw new Error('station with such name does not exist');
  }
  station = station[0];

  const countFilter = updateId ? {stationDestination: number, _id: {$ne: updateId}} : {stationDestination: number}
  const stationCargoesCount = await cargosModel.countDocuments(countFilter);
  console.log(stationCargoesCount);
  console.log(station.need * 1.2);
  if ( (stationCargoesCount + 1 > station.storage)
    || (stationCargoesCount + 1 > station.need * 1.2)) {
    throw new Error('station cannot store any more cargoes');
  }
}

router.get('/', async (req, res) => {
  try {
    const filter = req.query;

    const cargos = await cargosModel.find(filter);
    res.json(cargos);
  } catch (e) {
    console.log('cargoes GET error: ', e.message);
    res.status(400).send();
  }
});

router.get('/:id', async (req, res) => {
  try {
    const {id} = req.params;

    const cargo = await cargosModel.findById(id);
    res.json(cargo);
  } catch (e) {
    console.log('cargoes GET error: ', e.message);
    res.status(400).send();
  }
});

router.post('/', async (req, res) => {
  try {
    const newCargo = req.body;
    const {planetDestination: cargoPlanet, stationDestination: cargoStation} = newCargo;

    if (cargoPlanet) {
      if (cargoStation) {
        return res.status(400).send('Cargo cannot be sent to a planet and a station at the same time')
      }

      await validatePlanet(cargoPlanet);
    } else if (cargoStation) {
      await validateStation(cargoStation);
    }

    await cargosModel.create(newCargo);
    const cargos = await cargosModel.find();

    res.json(cargos);
  } catch (e) {
    console.log('cargoes POST error: ', e.message);
    res.status(400).send(e.message);
  }
});

router.put('/', async (req, res) => {
  try {
    const {id, data} = req.body;
    const {planetDestination: cargoPlanet, stationDestination: cargoStation} = data;

    if (cargoPlanet) {
      if (cargoStation) {
        return res.status(400).send('Cargo cannot be sent to a planet and a station at the same time')
      }

      await validatePlanet(cargoPlanet, id);
    } else if (cargoStation) {
      await validateStation(cargoStation, id);
    }

    await cargosModel.findByIdAndUpdate(id, data);

    res.send();
  } catch (e) {
    console.log('cargoes PUT error: ', e.message);
    res.status(400).send(e.message);
  }
})

router.delete('/', async (req, res) => {
  const {id} = req.body;

  cargosModel.findByIdAndDelete(id, (err) => {
    if (err) {
      console.log('cargoes DELETE error: ', err.message);
      res.status(400).send(err.message);
    }
    else {
      res.send();
    }
  });
})

module.exports = router;
