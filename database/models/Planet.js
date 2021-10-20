const {Schema, model} = require('mongoose');

const planetsScheme = new Schema({
  name: {type: String, required: true, unique: true},
  weight: {type: Number, required: true},
  storage: {type: Number, required: true},
}, { versionKey: false });

module.exports = model('Planet', planetsScheme);
