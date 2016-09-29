var chai = require('chai'),
    expect = chai.expect,
    _ = require('../lib/underscore-mixins');

describe('_.nest', function() {

   it('nests arrays of arrays correctly', function() {
      var arrays = [
         [ 'printer', 'query', 'epsoncolor' ],
         [ 'printer', [ 'view', 'query' ], 'lp7200' ],
         [ 'printer', 'query', '*' ],
         [ 'printer', 'reboot', 'lp7200' ],
         [ 'user', 'view', '1234' ],
         [ 'user', '*', '5678' ],
      ],
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
      result = _(arrays).nest();
      expect(result).to.eql(expected);
   });

   it('handles redundant wildcards', function() {
      var arrays = [
         [ 'printer', 'query', 'epsoncolor' ],
         [ 'printer', [ 'view', 'query' ], 'lp7200' ],
         [ 'printer', 'query', '*' ],
         [ 'printer', 'reboot', 'lp7200' ],
         [ 'user', 'view', '1234' ],
         [ 'user', '*', '5678' ],
         [ 'printer', 'query', '*', '2ndfloor' ],
         [ 'printer', 'query', '*', '2ndfloor', 'eastside' ],
      ],
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
      result = _(arrays).nest();
      expect(result).to.eql(expected);
   });
});
