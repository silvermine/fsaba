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

export const VIEW_BUDGET: RoleDefinition = {
   roleID: 'view-budget',
   policies: [
      {
         effect: PolicyEffect.Allow,
         actions: [ 'budget:View' ],
         resources: [ 'budget:*' ],
         conditions: [
            {
               type: PolicyConditionMatchType.StringMatches,
               field: 'budget:OwningDepartment',
               value: '{CONTEXT_VALUE:department}',
            },
            {
               type: PolicyConditionMatchType.StringMatches,
               field: 'budget:ProductLine',
               value: '{CONTEXT_VALUE:product}',
            },
         ],
      },
   ],
};

export const BUDGET_VIEWER_SINGLE_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

export const BUDGET_VIEWER_SINGLE: Claims = {
   subjectID: BUDGET_VIEWER_SINGLE_ID,
   roles: [
      { roleID: VIEW_BUDGET.roleID, contextValue: { product: 'kazoo', department: 'manufacturing' } },
   ],
};

export const BUDGET_VIEWER_MFG_HEAD_ID = 'b2c3d4e5-f6a7-8901-bcde-f23456789012';

export const BUDGET_VIEWER_MFG_HEAD: Claims = {
   subjectID: BUDGET_VIEWER_MFG_HEAD_ID,
   roles: [
      { roleID: VIEW_BUDGET.roleID, contextValue: { product: 'kazoo', department: 'manufacturing' } },
      { roleID: VIEW_BUDGET.roleID, contextValue: { product: 'rubber-duck', department: 'manufacturing' } },
   ],
};

export const BUDGET_VIEWER_KAZOO_PM_ID = 'c3d4e5f6-a7b8-9012-cdef-345678901234';

export const BUDGET_VIEWER_KAZOO_PM: Claims = {
   subjectID: BUDGET_VIEWER_KAZOO_PM_ID,
   roles: [
      { roleID: VIEW_BUDGET.roleID, contextValue: { product: 'kazoo', department: 'manufacturing' } },
      { roleID: VIEW_BUDGET.roleID, contextValue: { product: 'kazoo', department: 'marketing' } },
   ],
};

export const BUDGET_VIEWER_ACCOUNTING_HEAD_ID = 'd4e5f6a7-b8c9-0123-def0-456789012345';

export const BUDGET_VIEWER_ACCOUNTING_HEAD: Claims = {
   subjectID: BUDGET_VIEWER_ACCOUNTING_HEAD_ID,
   roles: [
      { roleID: VIEW_BUDGET.roleID, contextValue: { product: 'kazoo', department: 'manufacturing' } },
      { roleID: VIEW_BUDGET.roleID, contextValue: { product: 'rubber-duck', department: 'manufacturing' } },
      { roleID: VIEW_BUDGET.roleID, contextValue: { product: 'kazoo', department: 'marketing' } },
      { roleID: VIEW_BUDGET.roleID, contextValue: { product: 'rubber-duck', department: 'marketing' } },
      { roleID: VIEW_BUDGET.roleID, contextValue: { product: '*', department: 'office' } },
   ],
};

export const VIEW_NON_CONFIDENTIAL_BLUEPRINTS: RoleDefinition = {
   roleID: 'view-non-confidential-blueprints',
   policies: [
      {
         effect: PolicyEffect.Allow,
         actions: [ 'blueprints:View' ],
         resources: [ 'blueprints:*' ],
         conditions: [
            {
               type: PolicyConditionMatchType.StringMatches,
               field: 'blueprints:OwningDepartment',
               value: '{CONTEXT_VALUE:department}',
            },
            {
               type: PolicyConditionMatchType.StringDoesNotMatchIfExists,
               field: 'blueprints:Classification',
               value: 'confidential',
            },
         ],
      },
   ],
};

export const VIEW_ALL_BLUEPRINTS: RoleDefinition = {
   roleID: 'view-all-blueprints',
   policies: [
      {
         effect: PolicyEffect.Allow,
         actions: [ 'blueprints:View' ],
         resources: [ 'blueprints:*' ],
         conditions: [
            {
               type: PolicyConditionMatchType.StringMatches,
               field: 'blueprints:OwningDepartment',
               value: '{CONTEXT_VALUE:department}',
            },
         ],
      },
   ],
};

export const BLUEPRINT_VIEWER_ENGINEERING_ID = 'e5f6a7b8-c9d0-1234-ef01-567890123456';

export const BLUEPRINT_VIEWER_ENGINEERING: Claims = {
   subjectID: BLUEPRINT_VIEWER_ENGINEERING_ID,
   roles: [
      { roleID: VIEW_NON_CONFIDENTIAL_BLUEPRINTS.roleID, contextValue: { department: 'engineering' } },
   ],
};

export const BLUEPRINT_VIEWER_ENGINEERING_ALL_ID = 'f6a7b8c9-d0e1-2345-f012-678901234567';

export const BLUEPRINT_VIEWER_ENGINEERING_ALL: Claims = {
   subjectID: BLUEPRINT_VIEWER_ENGINEERING_ALL_ID,
   roles: [
      { roleID: VIEW_ALL_BLUEPRINTS.roleID, contextValue: { department: 'engineering' } },
   ],
};

export const BLUEPRINT_VIEWER_MULTI_DEPT_ID = 'a7b8c9d0-e1f2-3456-0123-789012345678';

export const BLUEPRINT_VIEWER_MULTI_DEPT: Claims = {
   subjectID: BLUEPRINT_VIEWER_MULTI_DEPT_ID,
   roles: [
      { roleID: VIEW_NON_CONFIDENTIAL_BLUEPRINTS.roleID, contextValue: { department: 'engineering' } },
      { roleID: VIEW_NON_CONFIDENTIAL_BLUEPRINTS.roleID, contextValue: { department: 'manufacturing' } },
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
   VIEW_BUDGET,
   VIEW_NON_CONFIDENTIAL_BLUEPRINTS,
   VIEW_ALL_BLUEPRINTS,
];
