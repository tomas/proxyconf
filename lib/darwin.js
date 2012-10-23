var exec = require('child_process').exec,
    os_version,
    network_setup_cmd = '/usr/sbin/networksetup';

exports.get = {}

exports.get.http = function(cb){

  get_os_version(function(err, version){
    if (err) return cb(err);

    if (version) os_version = version; // cache so we skip subsequent calls
    var service_name = get_service_name(version);

    get_proxy_for_service(service, function(err, data){
      if (!err && data) return cb(null, data);

      // nothing found for Airport, look for Ethernet
      get_proxy_for_service('Ethernet', cb);
    });
  })

}

var get_os_version = function(cb){
  if (os_version) return cb(null, os_version);
  exec('sw_vers -productVersion', function(err, stdout){
    cb(err, stdout ? stdout.toString().trim() : null)
  })
}

var get_service_name = function(osx_version){
  network_service = "AirPort";

  if (parseFloat(osx_version) >= 10.7){
    network_service = 'Wi-Fi';
    airport_name = 'en1';
    // airtport_name = '(networksetup -listallhardwareports | grep -A 1 "${network_service}" | grep Device | cut -c 9-12';
  } else if (parseFloat(osx_version) > 10.6){
    airport_name = 'AirPort';
  }

  return network_service;
}

var get_proxy_for_service = function(service, cb){
  get_proxy_by_type(service, 'webproxy', function(err, data){
    if (!err && data) cb(null, data);

    // nothing found for HTTP proxy, look for HTTPS
    get_proxy_by_type(service, 'securewebproxy', cb);
  })
}

var get_proxy_by_type = function(service, type, cb){
  var cmd = 'networksetup -get' + type + '"' + service + '"';
  cmd +=    " | grep -e 'Enabled.*Yes' -A2 | awk {'print $2'}";
  cmd +=    " | awk {'getline l1; getline l2; print \"http://\"l1\":\"l2'}";
  exec(cmd, cb);
}
