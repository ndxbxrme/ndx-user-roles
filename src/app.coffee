'use strict'

module.exports = (ndx) ->
  ndx.app.use (req, res, next) ->
    if not req.user
      req.user = {}
    req.user.addRole = (role) ->
      addKey = (root, key) ->
        if not root[key]
          root[key] = {}
        root[key]
      keys = role.split /\./g
      if not req.user.roles
        req.user.roles = {}
      root = req.user.roles
      for key in keys
        root = addKey root, key
    req.user.removeRole = (role) ->
      getKey = (root, key) ->
        root[key]
      keys = role.split /\./g
      if req.user.roles and keys.length
        root = req.user.roles
        i = 0
        key = ''
        while i < keys.length - 1
          key = keys[i]
          root = getKey root, key
          i++
        key = keys[keys.length - 1]
        if root[key]
          delete root[key]
    req.user.hasRole = (role) ->
      getKey = (root, key) ->
        root[key]
      keys = role.split /\./g
      allgood = false
      if req.user.roles
        root = req.user.roles
        for key in keys
          root = getKey root, key
          if root
            allgood = true
          else
            allgood = false
            break
      allgood
    next()
  ndx.authenticate = (role) ->
    (req, res, next) ->
      if req.user
        rolesToCheck = []
        getRole = (role) ->
          type = Object.prototype.toString.call role
          if type is '[object Array]'
            for r in role
              getRole r
          else if type is '[object Function]'
            r = role req
            getRole r
          else if type is '[object String]'
            if rolesToCheck.indexOf(role) is -1
              rolesToCheck.push role
        getRole role
        truth = true
        for r in rolesToCheck
          truth = truth and req.user.hasRole(r)
        if truth
          next()
        else
          res.json
            error: 'Not authenticated'
      else
        res.json
          error: 'Not authenticated'