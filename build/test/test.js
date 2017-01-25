(function() {
  'use strict';
  var ndx;

  ndx = require('ndx-server').use(require('../app.js')).use(function(ndx) {
    ndx.database.exec('INSERT INTO users VALUES ?', [
      {
        name: 'bbabbayaya',
        _id: 'bababa'
      }
    ]);
    return ndx.app.use(function(req, res, next) {
      ndx.extend(req.user, ndx.database.exec('SELECT * FROM users')[0]);
      req.user.addRole('boom.titz');
      console.log(req.user);
      return next();
    });
  }).controller(function(ndx) {
    return ndx.app.get('/', ndx.authenticate(function(req) {
      console.log('req.user', req.user);
      return ['boom.titz'];
    }), function(req, res) {
      return res.end('howdy');
    });
  }).start();

}).call(this);

//# sourceMappingURL=test.js.map
