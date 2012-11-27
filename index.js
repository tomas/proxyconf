var os_name = process.platform.toLowerCase(),
    os = require('./lib/' + os_name);

exports.get = function(type, cb){
  if (typeof os.get[type] != 'function')
    return cb(new Error("Not implemented: " + type));

  os.get[type](function(err, data){
    cb(err, data ? data.trim() : null);
  })
}

exports.set = function(type, val, cb){
  if (typeof os.set[type] != 'function')
    return cb(new Error("Not implemented: " + type));

  os.set[type](val, cb);
}
