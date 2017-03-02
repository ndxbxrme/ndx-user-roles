# ndx-user-roles
### user roles for [ndx-framework](https://github.com/ndxbxrme/ndx-framework) apps
install with  
`npm install --save ndx-user-roles`  
## what it does  
ndx-user roles adds these methods to `req.user`  
#### `req.user.addRole(role)`  
adds a role to the current user  
`req.user.addRole 'agency.admin'`
#### `req.user.removeRole(role)`
removes a role from the current user  
`req.user.removeRole 'agency.admin'`  
#### `req.user.hasRole(role)`
checks if a user has a specific role  
`role` can be a string, an array or a function that returns either a string or an array of role names  
`req.user.hasRole 'agency.admin'`  

`req.user.hasRole ['superadmin', 'admin']`  


```coffeescript
req.user.hasRole ->
  permissions = ndx.database.exec 'SELECT * FROM permissions WHERE userId=? AND agencyId=?', [req.user._id, req.body.agencyId]
  if permissions and permissions.length and permissions[0].canDoThisThing
    res.end 'you\'re cool'
  else
    next 'not permitted'
  
```
ndx-user-roles also upgrades `ndx.authenticate()` to accept the same arguments as `req.user.hasRole`  

```coffeescript
ndx.app.get '/api/protected', ndx.authenticate(['superadmin', 'admin']), (req, res, next) ->
  res.end 'you\'re cool'
```