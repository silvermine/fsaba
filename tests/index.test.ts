import { expect } from 'chai';
import {
   AuthorizerFactory,
   IsAllowedOpts,
} from '../src/index';
import {
   ALL_ROLES,
   SIMPLE_USER_ID,
   ROOT_ADMIN_USER_ID,
   SIMPLE_USER,
   POWER_USER,
   AUTH_ADMIN_ALL_OTHERS_USER,
   AUTH_ADMIN_USER,
   ROOT_ADMIN_USER,
   ORG_BUSINESS_ACCOUNT_ADMIN_CONJUNCTIVE,
   ORG_BUSINESS_ACCOUNT_ADMIN_ROOT_ARRAY,
   POWER_USER_ID,
   AUTH_ADMIN_ALL_OTHERS_USER_ID,
} from './sample-data';

describe('FSABA', () => {
   it('works as expected for a variety of users, actions, etc (general integration smoke test)', () => {
      const factory = new AuthorizerFactory(ALL_ROLES),
            simpleUserAccountOpts: Partial<IsAllowedOpts> = { context: { 'account:owner': SIMPLE_USER_ID } },
            rootUserAccountOpts: Partial<IsAllowedOpts> = { context: { 'account:owner': ROOT_ADMIN_USER_ID } },
            simpleUser = factory.makeAuthorizerForSubject(SIMPLE_USER),
            powerUser = factory.makeAuthorizerForSubject(POWER_USER),
            authAdminAllOthers = factory.makeAuthorizerForSubject(AUTH_ADMIN_ALL_OTHERS_USER),
            authAdmin = factory.makeAuthorizerForSubject(AUTH_ADMIN_USER),
            rootAdmin = factory.makeAuthorizerForSubject(ROOT_ADMIN_USER),
            orgBusAcctAdminConj = factory.makeAuthorizerForSubject(ORG_BUSINESS_ACCOUNT_ADMIN_CONJUNCTIVE),
            orgBusAcctAdminRootArr = factory.makeAuthorizerForSubject(ORG_BUSINESS_ACCOUNT_ADMIN_ROOT_ARRAY);


      // The simple user should be able to do things for himself only
      expect(simpleUser.isAllowed('auth:GetSubject', `auth:principals/${SIMPLE_USER_ID}`)).to.eql(true);
      expect(simpleUser.isAllowed('auth:GetSubjectActivityTrail', `auth:principals/${SIMPLE_USER_ID}`)).to.eql(true);
      expect(simpleUser.isAllowed('auth:DoSomethingElse', `auth:principals/${SIMPLE_USER_ID}`)).to.eql(false);
      expect(simpleUser.isAllowed('money:GetBalance', 'money:accounts/some-account', simpleUserAccountOpts)).to.eql(true);
      expect(simpleUser.isAllowed('money:CreateTransfer', 'money:accounts/some-account', simpleUserAccountOpts)).to.eql(true);
      expect(simpleUser.isAllowed('money:CreateWithdrawal', 'money:accounts/some-account', simpleUserAccountOpts)).to.eql(true);
      // but not on other people's stuff
      expect(simpleUser.isAllowed('auth:GetSubject', `auth:principals/${ROOT_ADMIN_USER_ID}`)).to.eql(false);
      expect(simpleUser.isAllowed('auth:GetSubjectActivityTrail', `auth:principals/${ROOT_ADMIN_USER_ID}`)).to.eql(false);
      expect(simpleUser.isAllowed('auth:DoSomethingElse', `auth:principals/${ROOT_ADMIN_USER_ID}`)).to.eql(false);
      expect(simpleUser.isAllowed('money:GetBalance', 'money:accounts/some-account', rootUserAccountOpts)).to.eql(false);
      expect(simpleUser.isAllowed('money:CreateTransfer', 'money:accounts/some-account', rootUserAccountOpts)).to.eql(false);
      expect(simpleUser.isAllowed('money:CreateWithdrawal', 'money:accounts/some-account', rootUserAccountOpts)).to.eql(false);


      // The power user can administer his own auth and the auth for the simple user
      expect(powerUser.isAllowed('auth:GetSubject', `auth:principals/${SIMPLE_USER_ID}`)).to.eql(true);
      expect(powerUser.isAllowed('auth:GetSubjectActivityTrail', `auth:principals/${SIMPLE_USER_ID}`)).to.eql(true);
      expect(powerUser.isAllowed('auth:DoSomethingElse', `auth:principals/${SIMPLE_USER_ID}`)).to.eql(false);
      expect(powerUser.isAllowed('auth:GetSubject', `auth:principals/${POWER_USER_ID}`)).to.eql(true);
      expect(powerUser.isAllowed('auth:GetSubjectActivityTrail', `auth:principals/${POWER_USER_ID}`)).to.eql(true);
      expect(powerUser.isAllowed('auth:DoSomethingElse', `auth:principals/${POWER_USER_ID}`)).to.eql(false);
      // but nothing with money
      expect(powerUser.isAllowed('money:GetBalance', 'money:accounts/some-account', simpleUserAccountOpts)).to.eql(false);
      expect(powerUser.isAllowed('money:CreateTransfer', 'money:accounts/some-account', simpleUserAccountOpts)).to.eql(false);
      expect(powerUser.isAllowed('money:CreateWithdrawal', 'money:accounts/some-account', simpleUserAccountOpts)).to.eql(false);
      expect(powerUser.isAllowed('money:GetBalance', 'money:accounts/some-account', rootUserAccountOpts)).to.eql(false);
      expect(powerUser.isAllowed('money:CreateTransfer', 'money:accounts/some-account', rootUserAccountOpts)).to.eql(false);
      expect(powerUser.isAllowed('money:CreateWithdrawal', 'money:accounts/some-account', rootUserAccountOpts)).to.eql(false);


      // This user has the "admin others' auth" role like the previous user, but with a
      // "*" instead of a specific other user, so can do the prescribed actions on anyone
      expect(authAdminAllOthers.isAllowed('auth:GetSubject', `auth:principals/${SIMPLE_USER_ID}`)).to.eql(true);
      expect(authAdminAllOthers.isAllowed('auth:GetSubjectActivityTrail', `auth:principals/${SIMPLE_USER_ID}`)).to.eql(true);
      expect(authAdminAllOthers.isAllowed('auth:DoSomethingElse', `auth:principals/${SIMPLE_USER_ID}`)).to.eql(false);
      expect(authAdminAllOthers.isAllowed('auth:GetSubject', `auth:principals/${POWER_USER_ID}`)).to.eql(true);
      expect(authAdminAllOthers.isAllowed('auth:GetSubjectActivityTrail', `auth:principals/${POWER_USER_ID}`)).to.eql(true);
      expect(authAdminAllOthers.isAllowed('auth:DoSomethingElse', `auth:principals/${POWER_USER_ID}`)).to.eql(false);
      expect(authAdminAllOthers.isAllowed('auth:GetSubject', `auth:principals/${AUTH_ADMIN_ALL_OTHERS_USER_ID}`)).to.eql(true);
      expect(authAdminAllOthers.isAllowed('auth:GetSubjectActivityTrail', `auth:principals/${AUTH_ADMIN_ALL_OTHERS_USER_ID}`)).to.eql(true);
      expect(authAdminAllOthers.isAllowed('auth:DoSomethingElse', `auth:principals/${AUTH_ADMIN_ALL_OTHERS_USER_ID}`)).to.eql(false);
      expect(authAdminAllOthers.isAllowed('auth:GetSubject', `auth:principals/${ROOT_ADMIN_USER_ID}`)).to.eql(true);
      expect(authAdminAllOthers.isAllowed('auth:GetSubjectActivityTrail', `auth:principals/${ROOT_ADMIN_USER_ID}`)).to.eql(true);
      expect(authAdminAllOthers.isAllowed('auth:DoSomethingElse', `auth:principals/${ROOT_ADMIN_USER_ID}`)).to.eql(false);
      // but nothing with money
      expect(authAdminAllOthers.isAllowed('money:GetBalance', 'money:accounts/some-account', simpleUserAccountOpts)).to.eql(false);
      expect(authAdminAllOthers.isAllowed('money:CreateTransfer', 'money:accounts/some-account', simpleUserAccountOpts)).to.eql(false);
      expect(authAdminAllOthers.isAllowed('money:CreateWithdrawal', 'money:accounts/some-account', simpleUserAccountOpts)).to.eql(false);
      expect(authAdminAllOthers.isAllowed('money:GetBalance', 'money:accounts/some-account', rootUserAccountOpts)).to.eql(false);
      expect(authAdminAllOthers.isAllowed('money:CreateTransfer', 'money:accounts/some-account', rootUserAccountOpts)).to.eql(false);
      expect(authAdminAllOthers.isAllowed('money:CreateWithdrawal', 'money:accounts/some-account', rootUserAccountOpts)).to.eql(false);


      // This user can do `auth:*` on `auth:*`
      expect(authAdmin.isAllowed('auth:GetSubject', `auth:principals/${SIMPLE_USER_ID}`)).to.eql(true);
      expect(authAdmin.isAllowed('auth:GetSubjectActivityTrail', `auth:principals/${SIMPLE_USER_ID}`)).to.eql(true);
      expect(authAdmin.isAllowed('auth:DoSomethingElse', `auth:principals/${SIMPLE_USER_ID}`)).to.eql(true);
      expect(authAdmin.isAllowed('auth:GetSubject', `auth:principals/${POWER_USER_ID}`)).to.eql(true);
      expect(authAdmin.isAllowed('auth:GetSubjectActivityTrail', `auth:principals/${POWER_USER_ID}`)).to.eql(true);
      expect(authAdmin.isAllowed('auth:DoSomethingElse', `auth:principals/${POWER_USER_ID}`)).to.eql(true);
      expect(authAdmin.isAllowed('auth:GetSubject', `auth:principals/${AUTH_ADMIN_ALL_OTHERS_USER_ID}`)).to.eql(true);
      expect(authAdmin.isAllowed('auth:GetSubjectActivityTrail', `auth:principals/${AUTH_ADMIN_ALL_OTHERS_USER_ID}`)).to.eql(true);
      expect(authAdmin.isAllowed('auth:DoSomethingElse', `auth:principals/${AUTH_ADMIN_ALL_OTHERS_USER_ID}`)).to.eql(true);
      expect(authAdmin.isAllowed('auth:GetSubject', `auth:principals/${ROOT_ADMIN_USER_ID}`)).to.eql(true);
      expect(authAdmin.isAllowed('auth:GetSubjectActivityTrail', `auth:principals/${ROOT_ADMIN_USER_ID}`)).to.eql(true);
      expect(authAdmin.isAllowed('auth:DoSomethingElse', `auth:principals/${ROOT_ADMIN_USER_ID}`)).to.eql(true);
      expect(authAdmin.isAllowed('money:CreateWithdrawal', 'money:accounts/some-account')).to.eql(false);
      // but nothing with money
      expect(authAdmin.isAllowed('money:GetBalance', 'money:accounts/some-account', simpleUserAccountOpts)).to.eql(false);
      expect(authAdmin.isAllowed('money:CreateTransfer', 'money:accounts/some-account', simpleUserAccountOpts)).to.eql(false);
      expect(authAdmin.isAllowed('money:CreateWithdrawal', 'money:accounts/some-account', simpleUserAccountOpts)).to.eql(false);
      expect(authAdmin.isAllowed('money:GetBalance', 'money:accounts/some-account', rootUserAccountOpts)).to.eql(false);
      expect(authAdmin.isAllowed('money:CreateTransfer', 'money:accounts/some-account', rootUserAccountOpts)).to.eql(false);
      expect(authAdmin.isAllowed('money:CreateWithdrawal', 'money:accounts/some-account', rootUserAccountOpts)).to.eql(false);


      // Root user can do pretty much anything
      expect(rootAdmin.isAllowed('auth:GetSubject', `auth:principals/${SIMPLE_USER_ID}`)).to.eql(true);
      expect(rootAdmin.isAllowed('auth:GetSubjectActivityTrail', `auth:principals/${SIMPLE_USER_ID}`)).to.eql(true);
      expect(rootAdmin.isAllowed('auth:DoSomethingElse', `auth:principals/${SIMPLE_USER_ID}`)).to.eql(true);
      expect(rootAdmin.isAllowed('auth:GetSubject', `auth:principals/${POWER_USER_ID}`)).to.eql(true);
      expect(rootAdmin.isAllowed('auth:GetSubjectActivityTrail', `auth:principals/${POWER_USER_ID}`)).to.eql(true);
      expect(rootAdmin.isAllowed('auth:DoSomethingElse', `auth:principals/${POWER_USER_ID}`)).to.eql(true);
      expect(rootAdmin.isAllowed('auth:GetSubject', `auth:principals/${AUTH_ADMIN_ALL_OTHERS_USER_ID}`)).to.eql(true);
      expect(rootAdmin.isAllowed('auth:GetSubjectActivityTrail', `auth:principals/${AUTH_ADMIN_ALL_OTHERS_USER_ID}`)).to.eql(true);
      expect(rootAdmin.isAllowed('auth:DoSomethingElse', `auth:principals/${AUTH_ADMIN_ALL_OTHERS_USER_ID}`)).to.eql(true);
      expect(rootAdmin.isAllowed('auth:GetSubject', `auth:principals/${ROOT_ADMIN_USER_ID}`)).to.eql(true);
      expect(rootAdmin.isAllowed('auth:GetSubjectActivityTrail', `auth:principals/${ROOT_ADMIN_USER_ID}`)).to.eql(true);
      expect(rootAdmin.isAllowed('auth:DoSomethingElse', `auth:principals/${ROOT_ADMIN_USER_ID}`)).to.eql(true);
      // But the "deny" should not allow him to withdraw or transfer money unless he's the
      // account owner. He can, though, get balances.
      // Test first with a missing context.
      expect(rootAdmin.isAllowed('money:GetBalance', 'money:accounts/some-account')).to.eql(true);
      expect(rootAdmin.isAllowed('money:CreateWithdrawal', 'money:accounts/some-account')).to.eql(false);
      expect(rootAdmin.isAllowed('money:CreateTransfer', 'money:accounts/some-account')).to.eql(false);
      // Then with the context for another user's account - he should be able to get the
      // balance, but not create withdrawals or transfers.
      expect(rootAdmin.isAllowed('money:GetBalance', 'money:accounts/some-account', simpleUserAccountOpts)).to.eql(true);
      expect(rootAdmin.isAllowed('money:CreateTransfer', 'money:accounts/some-account', simpleUserAccountOpts)).to.eql(false);
      expect(rootAdmin.isAllowed('money:CreateWithdrawal', 'money:accounts/some-account', simpleUserAccountOpts)).to.eql(false);
      // Then with his own account - he should be able to do everything.
      expect(rootAdmin.isAllowed('money:GetBalance', 'money:accounts/some-account', rootUserAccountOpts)).to.eql(true);
      expect(rootAdmin.isAllowed('money:CreateTransfer', 'money:accounts/some-account', rootUserAccountOpts)).to.eql(true);
      expect(rootAdmin.isAllowed('money:CreateWithdrawal', 'money:accounts/some-account', rootUserAccountOpts)).to.eql(true);


      // The org business account admin should be able to administer accounts (money:* on
      // money:*) if they're from the same org (org-123), so long as the account type is
      // business-checking or business-savings. But should not be able to do auth things.

      const contextOrg123Ckng = { 'account:owner:org': 'org-123', 'account:type': 'business-checking' },
            contextOrg123Svngs = { 'account:owner:org': 'org-123', 'account:type': 'business-savings' },
            contextOrg123Loan = { 'account:owner:org': 'org-123', 'account:type': 'business-loan' },
            contextOrg456Ckng = { 'account:owner:org': 'org-456', 'account:type': 'business-checking' },
            contextOrg456Svngs = { 'account:owner:org': 'org-456', 'account:type': 'business-savings' },
            contextOrg456Loan = { 'account:owner:org': 'org-456', 'account:type': 'business-loan' };

      // First user uses a more complex, nested role with the allOf conjunction.
      expect(orgBusAcctAdminConj.isAllowed('auth:GetSubject', `auth:principals/${SIMPLE_USER_ID}`)).to.eql(false);
      expect(orgBusAcctAdminConj.isAllowed('money:GetBalance', 'money:accounts/acct1', { context: contextOrg123Ckng })).to.eql(true);
      expect(orgBusAcctAdminConj.isAllowed('money:GetBalance', 'money:accounts/acct1', { context: contextOrg123Svngs })).to.eql(true);
      expect(orgBusAcctAdminConj.isAllowed('money:GetBalance', 'money:accounts/acct1', { context: contextOrg123Loan })).to.eql(false);
      expect(orgBusAcctAdminConj.isAllowed('money:GetBalance', 'money:accounts/acct1', { context: contextOrg456Ckng })).to.eql(false);
      expect(orgBusAcctAdminConj.isAllowed('money:GetBalance', 'money:accounts/acct1', { context: contextOrg456Svngs })).to.eql(false);
      expect(orgBusAcctAdminConj.isAllowed('money:GetBalance', 'money:accounts/acct1', { context: contextOrg456Loan })).to.eql(false);

      // Next user uses a less-nested role with no allOf conjunction
      expect(orgBusAcctAdminRootArr.isAllowed('auth:GetSubject', `auth:principals/${SIMPLE_USER_ID}`)).to.eql(false);
      expect(orgBusAcctAdminRootArr.isAllowed('money:GetBalance', 'money:accounts/acct1', { context: contextOrg123Ckng })).to.eql(true);
      expect(orgBusAcctAdminRootArr.isAllowed('money:GetBalance', 'money:accounts/acct1', { context: contextOrg123Svngs })).to.eql(true);
      expect(orgBusAcctAdminRootArr.isAllowed('money:GetBalance', 'money:accounts/acct1', { context: contextOrg123Loan })).to.eql(false);
      expect(orgBusAcctAdminRootArr.isAllowed('money:GetBalance', 'money:accounts/acct1', { context: contextOrg456Ckng })).to.eql(false);
      expect(orgBusAcctAdminRootArr.isAllowed('money:GetBalance', 'money:accounts/acct1', { context: contextOrg456Svngs })).to.eql(false);
      expect(orgBusAcctAdminRootArr.isAllowed('money:GetBalance', 'money:accounts/acct1', { context: contextOrg456Loan })).to.eql(false);

      // with missing context, should be denied
      expect(orgBusAcctAdminRootArr.isAllowed('money:GetBalance', 'money:accounts/acct1')).to.eql(false);
   });
});
