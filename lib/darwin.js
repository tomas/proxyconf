var exec = require('child_process').exec,
    os_version,
    network_service,
    network_setup_cmd = '/usr/sbin/networksetup';

exports.get = {}

exports.get.http = function(cb){
  get_proxy('webproxy', cb);
}

exports.get.https = function(cb){
  get_proxy('securewebproxy', cb);
}

var get_proxy = function(type, cb){

  get_os_version(function(err, version){
    if (err) return cb(err);

    var service_name = get_wifi_name(version);

    get_proxy_by_type(service_name, type, function(err, data){
      if (!err && data) return cb(null, data);

      // nothing found for Airport/Wi-Fi, look for Ethernet
      get_proxy_by_type('Ethernet', type, cb);
    });
  })

}

var get_os_version = function(cb){
  if (os_version) return cb(null, os_version);
  exec('sw_vers -productVersion', function(err, stdout){
    os_version = stdout ? stdout.toString().trim() : null;
    cb(err, os_version)
  })
}

var get_wifi_name = function(osx_version){
  network_service = "AirPort";

  if (parseFloat(osx_version) >= 10.7) {
    network_service = 'Wi-Fi';
    airport_name = 'en1';
    // airtport_name = '(networksetup -listallhardwareports | grep -A 1 "${network_service}" | grep Device | cut -c 9-12';
  } else if (parseFloat(osx_version) > 10.6) {
    airport_name = 'AirPort';
  }

  return network_service;
}

var get_proxy_by_type = function(service, type, cb){
  var cmd = 'networksetup -get' + type + ' "' + service + '"';
  cmd +=    " | grep -e '^Server: .' -B1 -A1 | awk {'print $2'}";
  cmd +=    " | awk {'getline l1; getline l2; print \"http://\"l1\":\"l2'}";
  exec(cmd, cb);
}
