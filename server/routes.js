/**
 * Main application routes
 */

'use strict';

var path = require('path');
var fs = require("fs");
var formidable = require('formidable');
var Beer = require('./api/beer/beer.model');

module.exports = function(app, gridfs) {

  // Insert routes below
  app.use('/beer', require('./api/beer')(gridfs));

  app.get('/upload', function(req, res) {
    var opts = {};
    opts.title = "Upload";
    opts.img = "hi";
    res.render("upload", {data: opts});
  });

  app.post('/upload', function(req, res){

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify if we want to allow multiple file uploads in a single request
    form.multiples = false;

    // store all uploads in the /public/img directory
    form.uploadDir = path.join(__dirname, '/public/img/');

    // every time a file has been uploaded successfully,
    // rename it to its orignal name
    form.on('file', function(field, file) {
      var imgpath = path.join(form.uploadDir, file.name);
      fs.rename(file.path, imgpath);

      // store the image in the gridfs database
      gridfs.putFile(imgpath, file.name, function(err, file) {
        if(err) console.log(err);
        console.log('saved img ' + file.filename + ' to database');

        // delete the file
        fs.unlink(imgpath, function(err) {
          if(err) console.log("error deleting file", file.filename);
          console.log('deleted file', file.filename, 'from local storage');
        });
      });
    });

    // log any errors that occur
    form.on('error', function(err) {
      console.log('An error has occured: \n' + err);
    });

    // once the review data has been uploaded, send a response to the client
    form.on('end', function() {
      res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req, function(err, fields, files) {
      var data = JSON.parse(fields.review);

      // store the form info in the main database
      var beer = new Beer({
        beer: data.beer,
        style: data.style,
        brewery: data.brewery,
        brewery_loc: data.brewery_loc,
        description: data.description,
        abv: data.abv,
        rating: data.rating,
        imgname: data.brewery + "_" + data.beer,
        date_of_drink: data.date
      });

      beer.save(function (err, result) {
        if (err) console.log(err);
        console.log("saved review for", result.beer, "to the database");
      });
    });
  });


  app.use('/', function(req, res) {
    res.status(200).json({"yeah":"boyee"});
  });

};
