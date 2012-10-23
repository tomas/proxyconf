var exec = require('child_process').exec,

exports.get = {}

exports.get.http = function(cb){
  exec('proxycfg', function(err, stdout){
    if (err) return cb(err);

    var proxy = stdout.match(/Proxy Server.+:\s+(\w+)/)[1];
    return (proxy && proxy != '') ? cb(null, proxy) : cb(new Error("Not found."))
  })
}
