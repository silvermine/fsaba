import { expect } from 'chai';
import { matcherSatisfied } from '../../src/utils/conditions-match';

describe('matcherSatisfied', () => {
   it('returns false on invalid matcher type', () => {
      expect(matcherSatisfied({ type: 'foo' } as any, {})).to.eql(false);
   });
});
