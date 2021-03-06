var fsaba = require('../fsaba'),
    chai = require('chai'),
    expect = chai.expect;

describe('fsaba: exact match permissions', function() {
   var permissions = [ 'category:edit', 'category:view' ];

   it('should permit when matching exactly', function() {
      expect(fsaba.considerPermissions(permissions).isPermitted('category:view')).to.equal(true);
   });

   it('should not permit when there is not an exact match', function() {
      expect(fsaba.considerPermissions(permissions).isPermitted('category:delete')).to.equal(false);
   });
});

describe('fsaba: multiple values can be matched', function() {
   var permissions = [ 'category:edit,view' ];

   it('should expand the list', function() {
      expect(fsaba.considerPermissions(permissions).isPermitted('category:view')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('category:delete')).to.equal(false);
   });
});

describe('fsaba: wildcard values can be matched', function() {
   var permissions = [ 'category:*' ];

   it('should expand the list', function() {
      expect(fsaba.considerPermissions(permissions).isPermitted('category:view')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('category:delete')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('user:delete')).to.equal(false);
   });

   it('should work with a root-level wildcard', function() {
      expect(fsaba.considerPermissions([ '*' ]).isPermitted('category:view:123')).to.equal(true);
      expect(fsaba.considerPermissions([ '*' ]).isPermitted('category:delete:123')).to.equal(true);
      expect(fsaba.considerPermissions([ '*' ]).isPermitted('user:delete:123')).to.equal(true);
   });

   it('should work with a root-level wildcard and other permissions', function() {
      expect(fsaba.considerPermissions([ '*', 'category:view' ]).isPermitted('category:view:123')).to.equal(true);
      expect(fsaba.considerPermissions([ '*', 'category:view' ]).isPermitted('category:delete:123')).to.equal(true);
      expect(fsaba.considerPermissions([ '*', 'category:view' ]).isPermitted('user:delete:123')).to.equal(true);
   });
});

describe('fsaba: instance level controls', function() {
   it('does exact matches', function() {
      var permissions = [ 'printer:query:lp7200' ];
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:query:lp7200')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:print:lp7200')).to.equal(false);
   });

   it('does list expansion', function() {
      var permissions = [ 'printer:query,print:lp7200' ];
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:query:lp7200')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:print:lp7200')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:reboot:lp7200')).to.equal(false);
   });

   it('does wildcard matches', function() {
      var permissions = [ 'printer:*:lp7200' ];
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:query:lp7200')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:print:lp7200')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:reboot:lp7200')).to.equal(true);

      expect(fsaba.considerPermissions(permissions).isPermitted('printer:query:epsoncolor')).to.equal(false);
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:print:epsoncolor')).to.equal(false);
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:reboot:epsoncolor')).to.equal(false);
   });

   it('does wildcard matches at instance levels', function() {
      var permissions = [ 'printer:print,query:*' ];
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:query:lp7200')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:print:lp7200')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:reboot:lp7200')).to.equal(false);

      expect(fsaba.considerPermissions(permissions).isPermitted('printer:query:epsoncolor')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:print:epsoncolor')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:reboot:epsoncolor')).to.equal(false);
   });

   it('does wildcard matches at multiple levels', function() {
      var permissions = [ 'printer:*:*' ];
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:query:lp7200')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:print:lp7200')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:reboot:lp7200')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:query:epsoncolor')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:print:epsoncolor')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:reboot:epsoncolor')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('user:delete')).to.equal(false);
   });
});

describe('fsaba: missing parts in actions', function() {
   var permissions = [ 'printer:print,query' ];

   it('does allow missing parts of action', function() {
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:query:lp7200')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:print:lp7200')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:reboot:lp7200')).to.equal(false);

      expect(fsaba.considerPermissions(permissions).isPermitted('printer:query:epsoncolor')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:print:epsoncolor')).to.equal(true);
      expect(fsaba.considerPermissions(permissions).isPermitted('printer:reboot:epsoncolor')).to.equal(false);
   });
});
