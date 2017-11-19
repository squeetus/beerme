var Grid = require('gridfs-stream');

module.exports = function(app, mongoose) {
  var GridFS = Grid(mongoose.connection.db, mongoose.mongo);
  var grid = {};
  grid.putFile = function(path, name, callback) {
      var writestream = GridFS.createWriteStream({
          filename: name
      });
      writestream.on('close', function (file) {
        callback(null, file);
      });
      fs.createReadStream(path).pipe(writestream);
  };
  grid.getFile = function(req, res, next){
    try {
  			var readstream = GridFS.createReadStream({filename: req.params.file});
  			res.set('Content-Type', 'image/jpg');
  			return readstream.pipe(res);
  	} catch (err) {
  			console.error(err);
  			return next(errors.create(404, "File not found."));
  	}
  };


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

  return grid;
};
