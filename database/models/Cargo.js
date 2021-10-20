const {Schema, model} = require('mongoose');

const cargosScheme = new Schema({
  name: {type: String, required: true},
  code: {type: Number, required: true, unique: true},
  weight: {type: Number, required: true},
  planetDestination: {type: String},
  stationDestination: {type: Number},
}, { versionKey: false });

module.exports = model('cargo', cargosScheme);
