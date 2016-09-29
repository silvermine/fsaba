var _ = require('underscore');

_.mixin({
   nest: function(rows, endValue) {
      endValue = endValue || true;
      return _.chain(rows)
         .reduce(function(memo, row) {
            var keys = (_.isArray(row[0]) ? row[0] : [ row[0] ]);
            _(keys).each(function(key) {
               if (row.length === 1) {
                  memo[key] = endValue;
               } else {
                  memo[key] = (memo[key] || []);

                  if (_.isArray(memo[key])) {
                     memo[key].push(row.slice(1));
                  }
               }
            });
            return memo;
         }, {})
         .each(function(rows, key, obj) {
            obj[key] = (rows === endValue ? endValue : _(rows).nest(endValue));
         })
         .value();
   }
});

module.exports = _;
