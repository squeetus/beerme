/**
 * Main application routes
 */

'use strict';

var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/beer', require('./api/beer'));

  app.use('/', function(req, res) {
    res.status(200).json({"yeah":"boyee"});
  });

};
