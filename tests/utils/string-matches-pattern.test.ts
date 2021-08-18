import { expect } from 'chai';
import stringMatchesPattern, { _convertPatternToRegExpString } from '../../src/utils/string-matches-pattern';

describe('_convertPatternToRegExpString', () => {
   function test(rawPattern: string, expected: string): void {
      const result = _convertPatternToRegExpString(rawPattern);

      if (result !== expected) {
         expect.fail(`Expected "${rawPattern}" to become "${expected}" but it was "${result}"`);
      }
   }

   it('works with a pattern that is simply single wildcard', () => {
      test('*', '.+');
   });

   it('works with a pattern that starts with a wildcard', () => {
      test('*/log/dmesg', '.+/log/dmesg');
   });

   it('works with a pattern that has multiple wildcards', () => {
      test('**', '.+');
      test('/var/**/*dmesg', '/var/.+/.+dmesg');
   });

   it('escapes RegExp special characters', () => {
      test('/var/log/*/something.log', '/var/log/.+/something\\.log');
      test('foo[0]{x}*bar', 'foo\\[0\\]\\{x\\}.+bar');
      test('foo\\bar*.log', 'foo\\\\bar.+\\.log');
      test('1 + 1 = *', '1 \\+ 1 = .+');
      test('1 ? 1 = *', '1 \\? 1 = .+');
      test('1 ^ 1 = *', '1 \\^ 1 = .+');
      test('1 $ 1 = *', '1 \\$ 1 = .+');
      test('1 (x) 1 = *', '1 \\(x\\) 1 = .+');
      test('1 | 1 = *', '1 \\| 1 = .+');
   });
});

describe('stringMatchesPattern', () => {

   it('returns true for exact matches', () => {
      expect(stringMatchesPattern('some/pattern', 'some/pattern')).to.eql(true);
   });

   it('returns false for non-matches when there are no wildcards', () => {
      expect(stringMatchesPattern('some/pattern', 'some/value')).to.eql(false);
   });

   it('returns true for * matches mid-string', () => {
      expect(stringMatchesPattern('/var/log/*/something.log', '/var/log/folder/something.log')).to.eql(true);
   });

   it('returns true for * matches at the end of the string', () => {
      expect(stringMatchesPattern('/var/log/*', '/var/log/folder/something.log')).to.eql(true);
   });

   it('returns true for multiple * matches', () => {
      expect(stringMatchesPattern('/var/log/*/*.log', '/var/log/folder/something.log')).to.eql(true);
      expect(stringMatchesPattern('/var/*/folder/*.log', '/var/log/folder/something.log')).to.eql(true);
      expect(stringMatchesPattern('/*/*/*/*.log', '/var/log/folder/something.log')).to.eql(true);
      // This type of pattern matching should not be confused with bash expansion or
      // similar globs. That is, a star does not match *only* a single "unit", as there is
      // no defined unit (in this case, it appears as if folders are units if you're
      // thinking of this as a bash expansion). A wildcard is equivalent to `.*` in a
      // regexp.
      expect(stringMatchesPattern('/*/*.log', '/var/log/folder/something.log')).to.eql(true);
   });

   it('returns true for * matches at the beginning of the string', () => {
      // See comment above about not comparing this to bash expansion
      expect(stringMatchesPattern('*.log', '/var/log/folder/something.log')).to.eql(true);
   });

   it('returns true for multiple * matches, including one at the end of the string', () => {
      expect(stringMatchesPattern('/var/*/folder/*', '/var/log/folder/something.log')).to.eql(true);
   });

   it('returns true for multiple * matches, including one at the beginning of the string', () => {
      expect(stringMatchesPattern('*/folder/*.log', '/var/log/folder/something.log')).to.eql(true);
   });

   it('returns true for multiple * matches, including ones at the beginning and end of the string', () => {
      expect(stringMatchesPattern('*/folder/*', '/var/log/folder/something.log')).to.eql(true);
   });

   it('returns true when there are multiple next-pattern-part matches after a wildcard', () => {
      // The `*` needs to act as a greedy operator. That is, it can't just look at the
      // first post-wildcard match (in this case, ":e:f:g") because there may be another
      // match for the next part of the pattern later in the string. In this case, it
      // can't stop at the first ":e:f:g" because that's not the end of the string (and
      // there's no trailing wildcard on the pattern), so the pattern would not match ...
      // but the pattern SHOULD match because it does start with "a:b:c:", end with
      // ":e:f:g", and have characters in between.
      expect(stringMatchesPattern('a:b:c:*:e:f:g', 'a:b:c:d:e:f:g:a:b:c:d:e:f:g')).to.eql(true);
   });

   it('returns true when the entire pattern is a single wildcard and the value is at least one char', () => {
      expect(stringMatchesPattern('*', 'a:b:c:d:e:f:g:a:b:c:d:e:f:g')).to.eql(true);
      expect(stringMatchesPattern('*', '/var/log/folder/something.log')).to.eql(true);
      expect(stringMatchesPattern('*', 'a')).to.eql(true);
   });

   it('returns false when the entire pattern is a single wildcard and the value is an empty string', () => {
      // because wildcards require a match of at least one character
      expect(stringMatchesPattern('*', '')).to.eql(false);
   });

   it('returns false when the value does not match the pattern', () => {
      // TODO: insert more tests
   });
});
