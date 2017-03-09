# ndx-user-roles
### user roles for [ndx-framework](https://github.com/ndxbxrme/ndx-framework) apps
install with  
`npm install --save ndx-user-roles`  
## what it does  
ndx-user roles adds these methods to `ndx.user`  
#### `ndx.user.addRole(role)`  
adds a role to the current user  
`ndx.user.addRole 'agency.admin'`
#### `ndx.user.removeRole(role)`
removes a role from the current user  
`ndx.user.removeRole 'agency.admin'`  
#### `ndx.user.hasRole(role)`
checks if a user has a specific role  
`role` can be a string, an array or a function that returns either a string or an array of role names  
`ndx.user.hasRole 'agency.admin'`  

`ndx.user.hasRole ['superadmin', 'admin']`  


```coffeescript
ndx.user.hasRole ->
  permissions = ndx.database.exec 'SELECT * FROM permissions WHERE userId=? AND agencyId=?', [ndx.user._id, req.body.agencyId]
  if permissions and permissions.length and permissions[0].canDoThisThing
    res.end 'you\'re cool'
  else
    next 'not permitted'
  
```
ndx-user-roles also upgrades `ndx.authenticate()` to accept the same arguments as `ndx.user.hasRole`  

```coffeescript
ndx.app.get '/api/protected', ndx.authenticate(['superadmin', 'admin']), (req, res, next) ->
  res.end 'you\'re cool'
```