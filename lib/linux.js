var exec = require('child_process').exec;

exports.get = {}

exports.get.http = function(cb){
  if (process.env['http_proxy']) return cb(null, process.env['http_proxy']);
  gsettings_get('http', cb);
}

exports.get.https = function(cb){
  if (process.env['https_proxy']) return cb(null, process.env['https_proxy']);
  gsettings_get('https', cb);
}

var gsettings_get = function(type, cb){
  exec('gsettings get org.gnome.system.proxy.' + type + ' host', function(err, host){
    if (err) return cb(err);

    exec('gsettings get org.gnome.system.proxy.' + type + ' port', function(err, port){
      if (err) return cb(err);

      var str = host.replace(/'/g, '').trim() + ':' + port.replace(/'/g, '').trim();
      cb(null, str);
    });
  })
}
