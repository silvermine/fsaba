import { expect } from 'chai';
import makeSubjectSpecificPolicies from '../../src/utils/make-subject-specific-policies';
import { ADMINISTER_OWN_AUTH, DO_NEARLY_EVERYTHING } from '../sample-data';

describe('makeSubjectSpecificPolicies', () => {
   it('throws error on roleID mismatch', () => {
      expect(() => { makeSubjectSpecificPolicies('subject', { roleID: DO_NEARLY_EVERYTHING.roleID }, ADMINISTER_OWN_AUTH); }).to.throw();
   });
});
