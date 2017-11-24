/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /beer              ->  index
 * POST    /beer              ->  create
 * GET     /beer/:id          ->  show
 */

'use strict';

var _ = require('lodash');
var Beer = require('./beer.model');

// Get list of all beer reviews
exports.index = function(req, res) {
  Beer.find(function (err, beers) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(beers);
  });
};

// Get a single beer review
exports.show = function(req, res) {
  Beer.findOne({beer: req.params.name},
            {__v: 0, _id: 0})
    .lean()
    .exec(function (err, beer) {
      if(err) { return handleError(res, err); }
      if(!beer) { return res.status(404).send('Not Found'); }
      var opts = {};

      opts.title = "Hi, beer";
      opts.beer = beer;
      opts.img = beer.imgname;

      return res.render('onebeer', {data: opts});
    });
};

// Creates a new beer review in the DB.
exports.create = function(req, res) {
  Beer.create(req.body, function(err, beer) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(beer);
  });
};

// Updates an existing thing in the DB.
// exports.update = function(req, res) {
//   if(req.body._id) { delete req.body._id; }
//   Thing.findById(req.params.id, function (err, thing) {
//     if (err) { return handleError(res, err); }
//     if(!thing) { return res.status(404).send('Not Found'); }
//     var updated = _.merge(thing, req.body);
//     updated.save(function (err) {
//       if (err) { return handleError(res, err); }
//       return res.status(200).json(thing);
//     });
//   });
// };

// Deletes a thing from the DB.
// exports.destroy = function(req, res) {
//   Thing.findById(req.params.id, function (err, thing) {
//     if(err) { return handleError(res, err); }
//     if(!thing) { return res.status(404).send('Not Found'); }
//     thing.remove(function(err) {
//       if(err) { return handleError(res, err); }
//       return res.status(204).send('No Content');
//     });
//   });
// };

function handleError(res, err) {
  return res.status(500).send(err);
}
