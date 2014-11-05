var fsaba = require('../fsaba'),
    chai = require('chai'),
    expect = chai.expect;

describe('considering permissions', function() {
   var permissions = [
      'category:edit',
      'category:view',
   ];

   it('should permit this', function() {
      expect(fsaba.considerPermissions(permissions).isPermitted('category:view')).to.equal(true);
   });

   it('should not permit this', function() {
      expect(fsaba.considerPermissions(permissions).isPermitted('category:delete')).to.equal(false);
   });

});
