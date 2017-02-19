(function() {
  'use strict';
  module.exports = function(ndx) {
    ndx.app.use('/api/*', function(req, res, next) {
      if (req.user) {
        if (Object.prototype.toString.call(req.user) === '[object Object]') {
          req.user.addRole = function(role) {
            var addKey, j, key, keys, len, root;
            addKey = function(root, key) {
              if (!root[key]) {
                root[key] = {};
              }
              return root[key];
            };
            keys = role.split(/\./g);
            if (!req.user.roles) {
              req.user.roles = {};
            }
            root = req.user.roles;
            for (j = 0, len = keys.length; j < len; j++) {
              key = keys[j];
              root = addKey(root, key);
            }
            return ndx.database.exec('UPDATE ' + ndx.settings.USER_TABLE + ' SET roles=? where _id=?', [req.user.roles, req.user._id]);
          };
          req.user.removeRole = function(role) {
            var getKey, i, key, keys, root;
            getKey = function(root, key) {
              return root[key];
            };
            keys = role.split(/\./g);
            if (req.user.roles && keys.length) {
              root = req.user.roles;
              i = 0;
              key = '';
              while (i < keys.length - 1) {
                key = keys[i];
                root = getKey(root, key);
                i++;
              }
              key = keys[keys.length - 1];
              if (root[key]) {
                delete root[key];
              }
            }
            return ndx.database.exec('UPDATE ' + ndx.settings.USER_TABLE + ' SET roles=? where _id=?', [req.user.roles, req.user._id]);
          };
          req.user.hasRole = function(role) {
            var allgood, getKey, j, key, keys, len, root;
            getKey = function(root, key) {
              return root[key];
            };
            keys = role.split(/\./g);
            allgood = false;
            if (req.user.roles) {
              root = req.user.roles;
              for (j = 0, len = keys.length; j < len; j++) {
                key = keys[j];
                root = getKey(root, key);
                if (root) {
                  allgood = true;
                } else {
                  allgood = false;
                  break;
                }
              }
            }
            return allgood;
          };
        }
      }
      return next();
    });
    return ndx.authenticate = function(role) {
      return function(req, res, next) {
        var getRole, j, len, r, rolesToCheck, truth;
        if (req.user) {
          rolesToCheck = [];
          getRole = function(role) {
            var j, len, r, results, type;
            type = Object.prototype.toString.call(role);
            if (type === '[object Array]') {
              results = [];
              for (j = 0, len = role.length; j < len; j++) {
                r = role[j];
                results.push(getRole(r));
              }
              return results;
            } else if (type === '[object Function]') {
              r = role(req);
              return getRole(r);
            } else if (type === '[object String]') {
              if (rolesToCheck.indexOf(role) === -1) {
                return rolesToCheck.push(role);
              }
            }
          };
          getRole(role);
          truth = false;
          for (j = 0, len = rolesToCheck.length; j < len; j++) {
            r = rolesToCheck[j];
            truth = truth || req.user.hasRole(r);
          }
          if (truth || !role) {
            return next();
          } else {
            throw ndx.UNAUTHORIZED;
          }
        } else {
          throw ndx.UNAUTHORIZED;
        }
      };
    };
  };

}).call(this);

//# sourceMappingURL=app.js.map
