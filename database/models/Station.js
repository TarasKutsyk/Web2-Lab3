const {Schema, model} = require('mongoose');

const stationsScheme = new Schema({
  number: {type: Number, required: true, unique: true},
  storage: {type: Number, required: true},
  need: {type: Number, required: true},
  planetLocation: {type: String}
}, { versionKey: false });

module.exports = model('station', stationsScheme);
