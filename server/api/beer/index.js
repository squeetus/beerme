'use strict';

var express = require('express');
var controller = require('./beer.controller');

module.exports = function(gridfs) {
  var router = express.Router();


  router.get('/', controller.index);
  router.post('/', controller.create);
  router.get('/:name', controller.show);

  router.stuff = function() {console.log('hi')};
  return router;
}
