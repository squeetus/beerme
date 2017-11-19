/**
 * Main application routes
 */

'use strict';

var path = require('path');

module.exports = function(app, gridfs) {

  // Insert routes below
  app.use('/beer', require('./api/beer'));

  app.get('/upload', function(req, res) {
    var opts = {};
    opts.title = "Upload";
    opts.img = "hi";
    res.render("upload", {data: opts});
  });

  app.use('/', function(req, res) {
    res.status(200).json({"yeah":"boyee"});
  });

};
