var _ = require('./underscore-mixins'),
    PermissionLevel,
    WILDCARD = '*';

PermissionLevel = function() {
   this.permissions = {};
};

PermissionLevel.prototype = {
   init: function(perms) {
      this.setPermissions(this.toGraph(perms));
   },

   setPermissions: function(graph) {
      var self = this;
      _(graph).each(function(val, key) {
         var nextLevel = val;
         if (nextLevel !== true) {
            nextLevel = new PermissionLevel();
            nextLevel.setPermissions(val);
         }
         self.permissions[key] = nextLevel;
      });
   },

   toGraph: function(perms) {
      return _.chain(perms)
         .map(function(str) {
            return str.split(':');
         })
         .map(function(arr) {
            return _(arr).map(function(level) {
               return level.indexOf(',') === -1 ? level : level.split(',');
            });
         })
         .nest(true)
         .value();
   },

   isPermitted: function(pieces) {
      var first = pieces[0],
          nextLevel = this.permissions[first] || this.permissions[WILDCARD];

      if (!nextLevel) {
         return false;
      }

      return nextLevel === true ? true : nextLevel.isPermitted(pieces.slice(1));
   },

   toAuthObject: function() {
      var self = this;
      return {
         isPermitted: function(action) {
            return self.isPermitted(action.split(':'));
         }
      };
   }

};

module.exports = PermissionLevel;
