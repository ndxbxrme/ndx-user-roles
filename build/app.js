(function() {
  'use strict';
  module.exports = function(ndx) {
    ndx.app.use('/api/*', function(req, res, next) {
      if (ndx.user) {
        if (Object.prototype.toString.call(ndx.user) === '[object Object]') {
          ndx.user.addRole = function(role) {
            var addKey, j, key, keys, len, root, where;
            addKey = function(root, key) {
              if (!root[key]) {
                root[key] = {};
              }
              return root[key];
            };
            keys = role.split(/\./g);
            if (!ndx.user.roles) {
              ndx.user.roles = {};
            }
            root = ndx.user.roles;
            for (j = 0, len = keys.length; j < len; j++) {
              key = keys[j];
              root = addKey(root, key);
            }
            where = {};
            where[ndx.settings.AUTO_ID] = ndx.user[ndx.settings.AUTO_ID];
            ndx.database.update(ndx.settings.USER_TABLE, {
              roles: ndx.user.roles
            }, where, null, true);
          };
          ndx.user.removeRole = function(role) {
            var getKey, i, key, keys, root;
            getKey = function(root, key) {
              return root[key];
            };
            keys = role.split(/\./g);
            if (ndx.user.roles && keys.length) {
              root = ndx.user.roles;
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
            where[ndx.settings.AUTO_ID] = ndx.user[ndx.settings.AUTO_ID];
            ndx.database.update(ndx.settings.USER_TABLE, {
              roles: ndx.user.roles
            }, where, null, true);
          };
          ndx.user.hasRole = function(role) {
            var allgood, getKey, j, key, keys, len, root;
            getKey = function(root, key) {
              return root[key];
            };
            keys = role.split(/\./g);
            allgood = false;
            if (ndx.user.roles) {
              root = ndx.user.roles;
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
    return ndx.authenticate = function(role, obj) {
      return function(req, res, next) {
        var getRole, j, len, r, rolesToCheck, truth;
        if (ndx.user) {
          rolesToCheck = [];
          getRole = function(role) {
            var j, len, r, type;
            type = Object.prototype.toString.call(role);
            if (type === '[object Array]') {
              for (j = 0, len = role.length; j < len; j++) {
                r = role[j];
                getRole(r);
              }
            } else if (type === '[object Function]') {
              r = role(obj);
              getRole(r);
            } else if (type === '[object String]') {
              if (rolesToCheck.indexOf(role) === -1) {
                rolesToCheck.push(role);
              }
            }
          };
          getRole(role);
          truth = false;
          for (j = 0, len = rolesToCheck.length; j < len; j++) {
            r = rolesToCheck[j];
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
  };

}).call(this);

//# sourceMappingURL=app.js.map
