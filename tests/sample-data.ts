import { RoleDefinition, PolicyEffect, PolicyConditionMatchType, Claims } from '../src';

export const ADMINISTER_OWN_AUTH: RoleDefinition = {
   roleID: 'administer-own-auth',
   policies: [
      {
         effect: PolicyEffect.Allow,
         actions: [
            'auth:GetSubject',
            'auth:GetSubjectActivityTrail',
            'auth:UpdatePassword',
         ],
         resources: [
            'auth:principals/{SUBJECT_ID}',
         ],
      },
   ],
};

export const ADMINISTER_OWN_MONEY: RoleDefinition = {
   roleID: 'administer-own-money',
   policies: [
      {
         effect: PolicyEffect.Allow,
         actions: [
            'money:GetBalance',
            'money:CreateTransfer',
            'money:CreateWithdrawal',
         ],
         resources: [
            'money:accounts/*',
         ],
         conditions: [
            {
               type: PolicyConditionMatchType.StringMatches,
               field: 'account:owner',
               value: '{SUBJECT_ID}',
            },
         ],
      },
   ],
};

export const ADMINISTER_OTHER_AUTH: RoleDefinition = {
   roleID: 'administer-other-auth',
   policies: [
      {
         effect: PolicyEffect.Allow,
         actions: [
            'auth:GetSubject',
            'auth:GetSubjectActivityTrail',
            'auth:UpdatePassword',
         ],
         resources: [
            'auth:principals/{CONTEXT_VALUE}',
         ],
      },
   ],
};

export const ADMINISTER_ALL_AUTH: RoleDefinition = {
   roleID: 'administer-all-auth',
   policies: [
      {
         effect: PolicyEffect.Allow,
         actions: [ 'auth:*' ],
         resources: [ 'auth:*' ],
      },
   ],
};

/**
 * Allows a user to do everything EXCEPT create transfers or withdrawals on accounts where
 * he is not the owner (he CAN get balances on those accounts).
 */
export const DO_NEARLY_EVERYTHING: RoleDefinition = {
   roleID: 'do-nearly-everything',
   policies: [
      {
         effect: PolicyEffect.Allow,
         actions: [ '*' ],
         resources: [ '*' ],
      },
      {
         effect: PolicyEffect.Deny,
         actions: [
            'money:CreateTransfer',
            'money:CreateWithdrawal',
         ],
         resources: [ '*' ],
         conditions: [
            {
               type: PolicyConditionMatchType.StringDoesNotMatch,
               field: 'account:owner',
               value: '{SUBJECT_ID}',
            },
         ],
      },
   ],
};

export const ADMINISTER_ORG_BUSINESS_ACCOUNTS_CONJUNCTIVE: RoleDefinition = {
   roleID: 'administer-money-same-org-conjunctive',
   policies: [
      {
         effect: PolicyEffect.Allow,
         actions: [ 'money:*' ],
         resources: [ 'money:*' ],
         conditions: [
            {
               allOf: [
                  {
                     type: PolicyConditionMatchType.StringMatches,
                     field: 'account:owner:org',
                     value: '{CONTEXT_VALUE}',
                  },
                  {
                     anyOf: [
                        {
                           type: PolicyConditionMatchType.StringMatches,
                           field: 'account:type',
                           value: 'business-checking',
                        },
                        {
                           type: PolicyConditionMatchType.StringMatches,
                           field: 'account:type',
                           value: 'business-savings',
                        },
                     ],
                  },
               ],
            },
         ],
      },
   ],
};

/**
 * This role does the same as the one above, but without the "allOf" conjunction since the
 * root conditions array should have the same behavior.
 */
export const ADMINISTER_ORG_BUSINESS_ACCOUNTS_ROOT_ARRAY: RoleDefinition = {
   roleID: 'administer-money-same-org-root-array',
   policies: [
      {
         effect: PolicyEffect.Allow,
         actions: [ 'money:*' ],
         resources: [ 'money:*' ],
         conditions: [
            {
               type: PolicyConditionMatchType.StringMatches,
               field: 'account:owner:org',
               value: '{CONTEXT_VALUE}',
            },
            {
               anyOf: [
                  {
                     type: PolicyConditionMatchType.StringMatches,
                     field: 'account:type',
                     value: 'business-checking',
                  },
                  {
                     type: PolicyConditionMatchType.StringMatches,
                     field: 'account:type',
                     value: 'business-savings',
                  },
               ],
            },
         ],
      },
   ],
};

export const SIMPLE_USER_ID = '62e5ed76-458f-49d4-833e-d4787a06603b';

export const SIMPLE_USER: Claims = {
   subjectID: SIMPLE_USER_ID,
   roles: [
      { roleID: ADMINISTER_OWN_AUTH.roleID },
      { roleID: ADMINISTER_OWN_MONEY.roleID },
   ],
};

export const POWER_USER_ID = 'ad8117c7-39a5-476b-9977-e21d6ac3b091';

export const POWER_USER: Claims = {
   subjectID: POWER_USER_ID,
   roles: [
      { roleID: ADMINISTER_OWN_AUTH.roleID },
      { roleID: ADMINISTER_OTHER_AUTH.roleID, contextValue: SIMPLE_USER_ID },
   ],
};

export const AUTH_ADMIN_ALL_OTHERS_USER_ID = 'eb805246-c574-44e4-9038-70f2542aaadb';

export const AUTH_ADMIN_ALL_OTHERS_USER: Claims = {
   subjectID: AUTH_ADMIN_ALL_OTHERS_USER_ID,
   roles: [
      { roleID: ADMINISTER_OTHER_AUTH.roleID, contextValue: '*' },
   ],
};

export const AUTH_ADMIN_USER_ID = 'cc59093c-92f3-4371-8b80-5d3955bbe260';

export const AUTH_ADMIN_USER: Claims = {
   subjectID: AUTH_ADMIN_USER_ID,
   roles: [
      { roleID: ADMINISTER_ALL_AUTH.roleID },
   ],
};

export const ROOT_ADMIN_USER_ID = '02becf45-35a4-4b4c-8e17-69159a883fa4';

export const ROOT_ADMIN_USER: Claims = {
   subjectID: ROOT_ADMIN_USER_ID,
   roles: [
      { roleID: DO_NEARLY_EVERYTHING.roleID },
   ],
};

export const ORG_BUSINESS_ACCOUNT_ADMIN_CONJUNCTIVE_ID = '8d536128-bb79-422c-9a19-bd9a5de5a314';

export const ORG_BUSINESS_ACCOUNT_ADMIN_CONJUNCTIVE: Claims = {
   subjectID: ORG_BUSINESS_ACCOUNT_ADMIN_CONJUNCTIVE_ID,
   roles: [
      { roleID: ADMINISTER_ORG_BUSINESS_ACCOUNTS_CONJUNCTIVE.roleID, contextValue: 'org-123' },
   ],
};

export const ORG_BUSINESS_ACCOUNT_ADMIN_ROOT_ARRAY_ID = 'f8713fc6-4288-432a-a77c-d5723de5b79b';

export const ORG_BUSINESS_ACCOUNT_ADMIN_ROOT_ARRAY: Claims = {
   subjectID: ORG_BUSINESS_ACCOUNT_ADMIN_ROOT_ARRAY_ID,
   roles: [
      { roleID: ADMINISTER_ORG_BUSINESS_ACCOUNTS_ROOT_ARRAY.roleID, contextValue: 'org-123' },
   ],
};

export const ALL_ROLES = [
   ADMINISTER_OWN_AUTH,
   ADMINISTER_OTHER_AUTH,
   ADMINISTER_ALL_AUTH,
   DO_NEARLY_EVERYTHING,
   ADMINISTER_OWN_MONEY,
   ADMINISTER_ORG_BUSINESS_ACCOUNTS_CONJUNCTIVE,
   ADMINISTER_ORG_BUSINESS_ACCOUNTS_ROOT_ARRAY,
];
