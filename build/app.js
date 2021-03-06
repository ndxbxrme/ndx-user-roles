(function() {
  'use strict';
  module.exports = function(ndx) {
    var extendUser;
    extendUser = function(user) {
      if (user) {
        if (Object.prototype.toString.call(user) === '[object Object]') {
          user.addRole = function(role) {
            var addKey, j, key, keys, len, root, where;
            addKey = function(root, key) {
              if (!root[key]) {
                root[key] = {};
              }
              return root[key];
            };
            keys = role.split(/\./g);
            if (!user.roles) {
              user.roles = {};
            }
            root = user.roles;
            for (j = 0, len = keys.length; j < len; j++) {
              key = keys[j];
              root = addKey(root, key);
            }
            where = {};
            where[ndx.settings.AUTO_ID] = user[ndx.settings.AUTO_ID];
            ndx.database.update(ndx.settings.USER_TABLE, {
              roles: user.roles
            }, where, null, true);
          };
          user.removeRole = function(role) {
            var getKey, i, key, keys, root;
            getKey = function(root, key) {
              return root[key];
            };
            keys = role.split(/\./g);
            if (user.roles && keys.length) {
              root = user.roles;
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
            where[ndx.settings.AUTO_ID] = user[ndx.settings.AUTO_ID];
            ndx.database.update(ndx.settings.USER_TABLE, {
              roles: user.roles
            }, where, null, true);
          };
          return user.hasRole = function(role) {
            var allgood, getKey, j, key, keys, len, root;
            getKey = function(root, key) {
              return root[key];
            };
            keys = role.split(/\./g);
            allgood = false;
            if (user.roles) {
              root = user.roles;
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
    };
    ndx.app.use('/api/*', function(req, res, next) {
      extendUser(ndx.user);
      return next();
    });
    ndx.authenticate = function(role, obj) {
      return function(req, res, next) {
        var j, k, len, len1, r, rolesToCheck, truth, type;
        if (ndx.user) {
          rolesToCheck = [];
          type = Object.prototype.toString.call(role);
          if (type === '[object Array]') {
            for (j = 0, len = role.length; j < len; j++) {
              r = role[j];
              if (rolesToCheck.indexOf(r) === -1) {
                rolesToCheck.push(r);
              }
            }
          } else if (type === '[object String]') {
            if (rolesToCheck.indexOf(role) === -1) {
              rolesToCheck.push(role);
            }
          } else if (type === '[object Function]') {
            role(obj, function(authenticated) {
              if (authenticated) {
                return next();
              } else {
                throw ndx.UNAUTHORIZED;
              }
            });
          }
          truth = false;
          for (k = 0, len1 = rolesToCheck.length; k < len1; k++) {
            r = rolesToCheck[k];
            truth = truth || ndx.user.hasRole(r);
          }
          rolesToCheck = null;
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
    return ndx.auth = {
      extendUser: extendUser
    };
  };

}).call(this);

//# sourceMappingURL=app.js.map
