'use strict'

module.exports = (ndx) ->
  ndx.app.use '/api/*', (req, res, next) ->
    if ndx.user
      if Object.prototype.toString.call(ndx.user) is '[object Object]'
        ndx.user.addRole = (role) ->
          addKey = (root, key) ->
            if not root[key]
              root[key] = {}
            root[key]
          keys = role.split /\./g
          if not ndx.user.roles
            ndx.user.roles = {}
          root = ndx.user.roles
          for key in keys
            root = addKey root, key
          where = {}
          where[ndx.settings.AUTO_ID] = ndx.user[ndx.settings.AUTO_ID]
          ndx.database.update ndx.settings.USER_TABLE,
            roles: ndx.user.roles
          , where, null, true
          return
        ndx.user.removeRole = (role) ->
          getKey = (root, key) ->
            root[key]
          keys = role.split /\./g
          if ndx.user.roles and keys.length
            root = ndx.user.roles
            i = 0
            key = ''
            while i < keys.length - 1
              key = keys[i]
              root = getKey root, key
              i++
            key = keys[keys.length - 1]
            if root[key]
              delete root[key]
          where[ndx.settings.AUTO_ID] = ndx.user[ndx.settings.AUTO_ID]
          ndx.database.update ndx.settings.USER_TABLE,
            roles: ndx.user.roles
          , where, null, true
          return
        ndx.user.hasRole = (role) ->
          getKey = (root, key) ->
            root[key]
          keys = role.split /\./g
          allgood = false
          if ndx.user.roles
            root = ndx.user.roles
            for key in keys
              root = getKey root, key
              if root
                allgood = true
              else
                allgood = false
                break
          allgood
    next()
  ndx.authenticate = (role, obj) ->
    (req, res, next) ->
      if ndx.user
        rolesToCheck = []
        type = Object.prototype.toString.call role
        if type is '[object Array]'
          for r in role
            if rolesToCheck.indexOf(r) is -1
              rolesToCheck.push r
        else if type is '[object String]'
          if rolesToCheck.indexOf(role) is -1
            rolesToCheck.push role
        else if type is '[object Function]'
          role obj, (authenticated) ->
            if authenticated
              return next()
            else
              throw ndx.UNAUTHORIZED
        truth = false
        for r in rolesToCheck
          truth = truth or ndx.user.hasRole(r)
        rolesToCheck = null
        if truth or not role
          return next()
        else
          throw ndx.UNAUTHORIZED
      else
        throw ndx.UNAUTHORIZED