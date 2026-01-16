import { expect } from 'chai';
import { AuthorizerFactory, Claims } from '../src';
import { ADMINISTER_OWN_AUTH, ADMINISTER_OTHER_AUTH, DO_NEARLY_EVERYTHING } from './sample-data';


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

});
