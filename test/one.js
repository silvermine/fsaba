var fsaba = require('../fsaba'),
    chai = require('chai'),
    expect = chai.expect;

describe('considering a subject', function() {
   var user = {
      permissions: [
         'category:edit',
         'category:view',
      ]
   };

   it('should permit this', function() {
      expect(fsaba.considerSubject(user).isPermitted('category:view')).to.equal(true);
   });

   it('should not permit this', function() {
      expect(fsaba.considerSubject(user).isPermitted('category:delete')).to.equal(false);
   });

});
