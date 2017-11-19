'use strict';

var express = require('express');
var controller = require('./beer.controller');
var router = express.Router();


router.get('/', controller.index);
router.post('/', controller.create);
router.get('/:name', controller.show);

module.exports = router;
