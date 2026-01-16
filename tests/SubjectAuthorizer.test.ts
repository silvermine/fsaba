import { expect } from 'chai';
import { AuthorizerFactory, Claims, SubjectAuthorizer } from '../src';
import {
   ADMINISTER_OWN_AUTH,
   ADMINISTER_OTHER_AUTH,
   DO_NEARLY_EVERYTHING,
   ALL_ROLES,
   BUDGET_VIEWER_KAZOO_PM,
   BUDGET_VIEWER_SINGLE,
   BUDGET_VIEWER_MFG_HEAD,
} from './sample-data';


describe('SubjectAuthorizer', () => {
   const allRoles1 = [
      ADMINISTER_OWN_AUTH,
      ADMINISTER_OTHER_AUTH,
   ];

   const allRoles2 = [
      ADMINISTER_OWN_AUTH,
      ADMINISTER_OTHER_AUTH,
      DO_NEARLY_EVERYTHING,
   ];

   const userID = '73885b55-2e0d-40bd-8cb3-2e59cf78ed87';

   const user: Claims = {
      subjectID: userID,
      roles: [
         { roleID: ADMINISTER_OWN_AUTH.roleID },
         { roleID: ADMINISTER_OTHER_AUTH.roleID, contextValue: '8e0fa760-9a1d-43ea-8686-768318d923b4' },
         { roleID: DO_NEARLY_EVERYTHING.roleID },
      ],
   };

   const factory1 = new AuthorizerFactory(allRoles1),
         factory2 = new AuthorizerFactory(allRoles2);

   it('ignores unknown roles when no opts provided', () => {
      expect(factory1.makeAuthorizerForSubject(user)).to.be.ok; // eslint-disable-line no-unused-expressions
      expect(factory2.makeAuthorizerForSubject(user)).to.be.ok; // eslint-disable-line no-unused-expressions
   });

   it('throws an error on unknown roles when requested', () => {
      expect(() => { factory1.makeAuthorizerForSubject(user, { throwOnUnknownRole: true }); }).to.throw();
      expect(factory2.makeAuthorizerForSubject(user, { throwOnUnknownRole: true })).to.be.ok; // eslint-disable-line no-unused-expressions
   });

   describe('hasPolicyGranting', () => {

      it('returns true if the user has a policy for the action', () => {
         const authorizer = new SubjectAuthorizer(ALL_ROLES, BUDGET_VIEWER_SINGLE);

         expect(authorizer.hasPolicyGranting('budget:View')).to.strictlyEqual(true);
      });

      it('returns false if the user does not have a policy for the action', () => {
         const authorizer = new SubjectAuthorizer(ALL_ROLES, BUDGET_VIEWER_SINGLE);

         expect(authorizer.hasPolicyGranting('budget:Create')).to.strictlyEqual(false);
      });

      it('returns true if the user has a policy matching resource prefix', () => {
         const authorizer = new SubjectAuthorizer(ALL_ROLES, BUDGET_VIEWER_KAZOO_PM);

         expect(authorizer.hasPolicyGranting('budget:View', { resourcePrefixPattern: 'budget:kazoo/*' })).to.strictlyEqual(true);
      });

      it('returns true if the policy resource is broader than the requested prefix', () => {
         const authorizer = new SubjectAuthorizer(ALL_ROLES, BUDGET_VIEWER_MFG_HEAD);

         // BUDGET_VIEWER_MFG_HEAD has budget:*
         expect(authorizer.hasPolicyGranting('budget:View', { resourcePrefixPattern: 'budget:kazoo/mktg/*' })).to.strictlyEqual(true);
      });

      it('returns false if the user has the action but on different resources', () => {
         const authorizer = new SubjectAuthorizer(ALL_ROLES, BUDGET_VIEWER_KAZOO_PM);

         // KAZOO PM has budget:View on budget:* but we can test with a non-matching
         // prefix.
         expect(authorizer.hasPolicyGranting('budget:View', { resourcePrefixPattern: 'budget-v2/*' })).to.strictlyEqual(false);
      });

      it('throws an error if resourcePrefixPattern does not end with a wildcard or contains internal wildcards', () => {
         const authorizer = new SubjectAuthorizer(ALL_ROLES, BUDGET_VIEWER_KAZOO_PM);

         expect(() => { authorizer.hasPolicyGranting('budget:View', { resourcePrefixPattern: 'budget:kazoo' }); }).to.throw();

         expect(() => { authorizer.hasPolicyGranting('budget:View', { resourcePrefixPattern: 'budget:*/foo' }); }).to.throw();

         expect(() => { authorizer.hasPolicyGranting('budget:View', { resourcePrefixPattern: '*budget:foo' }); }).to.throw();
      });

      it('correctly handles prefix match', () => {
         const authorizer = new SubjectAuthorizer(ALL_ROLES, BUDGET_VIEWER_KAZOO_PM);

         // BUDGET_VIEWER_KAZOO_PM has policy for budget:kazoo/*. The requested prefix is
         // budget:kazoo/mktg/*. This should be true because the policy resource
         // (budget:kazoo/*) matches the requested prefix (budget:kazoo/mktg/*).
         expect(authorizer.hasPolicyGranting('budget:View', { resourcePrefixPattern: 'budget:kazoo/mktg/*' })).to.strictlyEqual(true);

         // Now, if the requested prefix is budget:kaz*, it should still be true because
         // the requested resource prefix (budget:kaz*) matches the policy resource
         // (budget:kazoo/*).
         expect(authorizer.hasPolicyGranting('budget:View', { resourcePrefixPattern: 'budget:kaz*' })).to.strictlyEqual(true);
      });

   });

});
