var fsaba = require('../fsaba'),
    chai = require('chai'),
    expect = chai.expect,
    PermissionLevel = require('../lib/PermissionLevel'),
    defaultPerms;

defaultPerms = [
   'printer:query:epsoncolor',
   'printer:view,query:lp7200',
   'printer:query:*',
   'printer:reboot:lp7200',
   'user:view:1234',
   'user:*:5678',
];

describe('PermissionLevel:isPermitted', function() {
   it('permits things that should be permitted', function() {
      var pl = new PermissionLevel();
      pl.init(defaultPerms);
      expect(pl.isPermitted([ 'printer', 'reboot', 'lp7200' ])).to.eql(true);
      expect(pl.isPermitted([ 'printer', 'view', 'lp7200' ])).to.eql(true);
      expect(pl.isPermitted([ 'printer', 'query', 'lp7200' ])).to.eql(true);
      expect(pl.isPermitted([ 'printer', 'query', 'dotmatrix1000' ])).to.eql(true);
      expect(pl.isPermitted([ 'user', 'update', '5678' ])).to.eql(true);
   });

   it('does not permit things that should not be permitted', function() {
      var pl = new PermissionLevel();
      pl.init(defaultPerms);
      expect(pl.isPermitted([ 'printer', 'reboot', 'epsoncolor' ])).to.eql(false);
      expect(pl.isPermitted([ 'printer', 'view', 'epsoncolor' ])).to.eql(false);
      expect(pl.isPermitted([ 'user', 'update', '1234' ])).to.eql(false);
   });
});

describe('PermissionLevel:toGraph', function() {
   it('converts arrays of string permissions into an object graph correctly', function() {
      var root = new PermissionLevel(),
      expected = {
         'printer': {
            'query': {
               'epsoncolor': true,
               'lp7200': true,
               '*': true
            },
            'view': {
               'lp7200': true
            },
            'reboot': {
               'lp7200': true
            }
         },
         'user': {
            'view': {
               '1234': true
            },
            '*': {
               '5678': true
            }
         }
      },
      result = root.toGraph(defaultPerms);
      expect(result).to.eql(expected);
   });
});
