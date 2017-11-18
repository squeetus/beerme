'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BeerSchema = new Schema({
  beer: String,
  brewery: String,
  description: String,
  abv: Number,
  rating: Number,
  date_of_drink: { type: Date, default: Date.now() }
});

BeerSchema
    .virtual('imgname')
    .set(function(beer, brewery) {
        this.imgname = brewery + "_" + beer;
    })
    .get(function() { return this.imgname; });

module.exports = mongoose.model('Beer', BeerSchema);
