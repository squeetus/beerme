/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var fs = require('fs');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
	console.error('MongoDB connection error: ' + err);
	process.exit(-1);
	}
);

var Grid = require('gridfs-stream');
var GridFS = Grid(mongoose.connection.db, mongoose.mongo);

function putFile(path, name, callback) {
    var writestream = GridFS.createWriteStream({
        filename: name
    });
    writestream.on('close', function (file) {
      callback(null, file);
    });
    fs.createReadStream(path).pipe(writestream);
}

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

app.use('/test', function(req, res) {
	putFile(process.cwd() + "/server/public/img/foundersbreakfaststout.jpg", "foundersbreakfaststout.jpg", function(err, file) {
	console.log(err, file);
	});
});

app.use('/get/:file', function(req, res) {
	try {
			var readstream = GridFS.createReadStream({filename: req.params.file});
			res.set('Content-Type', 'image/jpg');
			return readstream.pipe(res);
	} catch (err) {
			console.error(err);
			return next(errors.create(404, "File not found."));
	}
});

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
