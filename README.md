# ndx-user-roles
### user roles for [ndx-framework](https://github.com/ndxbxrme/ndx-framework) apps
install with  
`npm install --save ndx-user-roles`  
## what it does  
ndx-user roles adds these methods to `req.user`  
#### `req.user.addRole(role)`  
adds a role to the current user  
eg, `req.user.addRole 'agency.admin'`
#### `req.user.removeRole(role)`
removes a role from the current user
eg, `req.user.removeRole 'agency.admin'`
#### `req.user.hasRole(role)`
checks if a user has a specific role  
`role` can be a string, an array or a function that returns either a string or an array of role names  
eg,`req.user.hasRole 'agency.admin'  
or `req.user.hasRole ['superadmin', 'admin']  
or
```coffeescript
req.user.hasRole ->
  permissions = ndx.database.exec 'SELECT * FROM permissions WHERE userId=? AND agencyId=?', [req.user._id, req.body.agencyId]
  if permissions and permissions.length and permissions[0].canDoThisThing
    res.end 'you\'re cool'
  else
    next 'not permitted'
  
```
ndx-user-roles also upgrades `ndx.authenticate()` to accept the same arguments as `req.user.hasRole`  
eg
```coffeescript
ndx.app.get '/api/protected', ndx.authenticate(['superadmin', 'admin']), (req, res, next) ->
  res.end 'you\'re cool'
```