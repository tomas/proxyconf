var proxyconf = require('./');

proxyconf.get('http', console.log);

proxyconf.get('https', console.log);
