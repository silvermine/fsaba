var PermissionLevel = require('./lib/PermissionLevel');

module.exports = {

   considerSubject: function(user) {
      user = user || {};
      return this.considerPermissions(user.permissions || []);
   },

   considerPermissions: function(permissions) {
      var root = new PermissionLevel();
      root.init(permissions);
      return root.toAuthObject();
   }

};
