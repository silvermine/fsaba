var _ = require('underscore');

module.exports = {

   parse: function(perms) {
      return {
         isPermitted: function(action) {
            // obviously this won't be the real implementation
            // just a stub to get the build framework committed
            return _(perms).contains(action);
         }
      };
   }

};
