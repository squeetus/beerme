var Grid = require('gridfs-stream');
var fs = require("fs");

module.exports = function() {

  var grid = {};
  var GridFS;

  grid.setupConnection = function(app, mongoose) {
      GridFS = Grid(mongoose.connection.db, mongoose.mongo);

      app.use('/test', function(req, res) {
        putFile(process.cwd() + "/server/public/img/foundersbreakfaststout.jpg", "foundersbreakfaststout.jpg", function(err, file) {
        console.log(err, file);
        });
      });

      app.use('/get/:name', function(req, res) {
        try {
            var readstream = GridFS.createReadStream({filename: req.params.name});
            res.set('Content-Type', 'image/jpg');
            return readstream.pipe(res);
        } catch (err) {
            console.error(err);
            return next(errors.create(404, "File not found."));
        }
      });
  };

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
  			var readstream = GridFS.createReadStream({filename: req.params.name});
  			res.set('Content-Type', 'image/jpg');
  			readstream.pipe(res);
  	} catch (err) {
  			console.error(err);
  			return next(errors.create(404, "File not found."));
  	}
  };

  return grid;
};
