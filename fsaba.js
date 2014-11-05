var parser = require('./lib/parser');

module.exports = {

   considerSubject: function(user) {
      return this.considerPermissions(user.permissions);
   },

   considerPermissions: function(permissions) {
      return parser.parse(permissions);
   }

};
