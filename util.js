function readJsonFileAsync(filepath, callback) {
    var fs = require("fs");
    fs.readFile(filepath, "utf-8", function(err, data) {
      if (err) {
        callback(err, null);
      } else {
        result = JSON.parse(data);
        if (result) {
          callback(null, result);
        } else {
          callback("parse error", null);
        }
      }
    });
  }

  module.exports = { readJsonFileAsync };