/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
// Insert seed models below
var Beer = require('../api/beer/beer.model');


// Insert seed data below
var beerSeed = require('../api/beer/beer.seed.json');

// Insert seed inserts below
Beer.find({}).remove(function() {
  Beer.create(beerSeed);
});
