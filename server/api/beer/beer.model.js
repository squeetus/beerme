'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BeerSchema = new Schema({
  beer: String,
  style: String,
  brewery: String,
  brewery_loc: String,
  description: String,
  abv: Number,
  rating: Number,
  imgname: {type: String, unique: true},
  date_of_drink: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Beer', BeerSchema);
