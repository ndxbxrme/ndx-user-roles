'use strict'

ndx = require 'ndx-server'
.use require '../app.js'
.use (ndx) ->
  ndx.database.exec 'INSERT INTO users VALUES ?', [{
    name: 'bbabbayaya'
    _id: 'bababa'
  }]
  ndx.app.use (req, res, next) ->
    ndx.extend ndx.user, ndx.database.exec('SELECT * FROM users')[0]
    ndx.user.addRole 'boom.titz'
    console.log ndx.user
    next()
.controller (ndx) ->
  ndx.app.get '/', ndx.authenticate((req) ->
    console.log 'ndx.user', ndx.user
    ['boom.titz']
  ), (req, res) ->
    res.end 'howdy'
.start()