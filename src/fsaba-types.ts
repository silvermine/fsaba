import { isArray, isEnumValue, isString, StringMap } from '@silvermine/toolbox';

/**
 * What affect does this policy have? Does it ALLOW actions, or DENY actions?
 */
export enum PolicyEffect {
   Allow = 'Allow',
   Deny = 'Deny',
}

/**
 * A policy condition limits the instances in which a policy is applied based on
 * additional contextual information beyond the action that's being taken and the resource
 * on which it's taken.
 *
 * For example, you could allow a user a certain action on all resources, and use a
 * condition to stipulate that the user must be the owner of the resource. Conditions are
 * evaluated after actions and resources, so a condition will not be evaluated if the
 * action and resource do not already match.
 *
 * If multiple conditions are provided, they are joined with an "AND". That is, all the
 * conditions in the array must match. For more complex conjunctions (i.e. to use "OR" for
 * conditions where _any_ of a set of conditions match, or to combine AND and OR clauses),
 * use `{ allOf: PolicyCondition[] }` and `{ anyOf: PolicyCondition[] }`.
 *
 * The context available for use in conditions varies for each action.
 */
export type PolicyCondition = PolicyConditionMatcher | PolicyConditionConjunction;


/**
 * Policy condition conjunctions allow you to define the logic required when multiple
 * conditions exist on a policy - either all the conditions must match, or at least one
 * (any of) the conditions must match.
 */
export type PolicyConditionConjunction = PolicyConditionConjunctionAllOf | PolicyConditionConjunctionAnyOf;

/**
 * Generally you will not use this type directly. It is used internally in FSABA.
 */
export type PolicyConditionConjunctionAllOf = { allOf: PolicyCondition[] };

/**
 * Generally you will not use this type directly. It is used internally in FSABA.
 */
export type PolicyConditionConjunctionAnyOf = { anyOf: PolicyCondition[] };


/**
 * How should the field and value in the policy condition be evaluated?
 */
export enum PolicyConditionMatchType {

   /**
    * Evaluate the value as a string, seeing if it matches the string in the condition.
    * Like actions and resources, a string-matches condition allows for a '*' as a
    * wildcard.
    */
   StringMatches = 'string-matches',

   /**
    * Evaluates the value as a string, negating the regular string match. That is, the
    * condition "passes" if the string value from the context fails to match the string in
    * the condition. Like actions and resources, a string-does-not-match condition allows
    * for a '*' as a wildcard.
    */
   StringDoesNotMatch = 'string-does-not-match',

   /**
    * Evaluate the value as a string, seeing if it matches the string in the condition.
    * If the field is missing from the context, the condition passes automatically.
    * Like actions and resources, a string-matches-if-exists condition allows for a '*' as
    * a wildcard.
    */
   StringMatchesIfExists = 'string-matches-if-exists',

   /**
    * Evaluates the value as a string, negating the regular string match. That is, the
    * condition "passes" if the string value from the context fails to match the string in
    * the condition. If the field is missing from the context, the condition passes
    * automatically. Like actions and resources, a string-does-not-match-if-exists
    * condition allows for a '*' as a wildcard.
    */
   StringDoesNotMatchIfExists = 'string-does-not-match-if-exists',

}


/**
 * Policy conditions are generally defined as a matcher, where a particular type of match
 * is performed on a field from the context.
 */
export interface PolicyConditionMatcher {

   /**
    * Once the value from the context is retrieved, how will it be matched against the
    * value defined in this condition.
    */
   type: PolicyConditionMatchType;

   /**
    * The field from the context from which to obtain the value.
    */
   field: string;

   /**
    * Defines the rule for what the value from the context must match.
    */
   value: any;
}


export function isPolicyConditionMatcher(v: any): v is PolicyConditionMatcher {
   return v
      && isString(v.field)
      && Object.getOwnPropertyNames(v).includes('value')
      && isEnumValue(PolicyConditionMatchType, v.type);
}

export function isPolicyConditionConjunctionAllOf(v: any): v is PolicyConditionConjunctionAllOf {
   return v && isArray(v.allOf) && (v.allOf as any[]).reduce((memo, cond) => {
      return memo && isPolicyCondition(cond);
   }, true);
}


export function isPolicyConditionConjunctionAnyOf(v: any): v is PolicyConditionConjunctionAnyOf {
   return v && isArray(v.anyOf) && (v.anyOf as any[]).reduce((memo, cond) => {
      return memo && isPolicyCondition(cond);
   }, true);
}


export function isPolicyConditionConjunction(v: any): v is PolicyConditionConjunctionAllOf {
   return isPolicyConditionConjunctionAllOf(v) || isPolicyConditionConjunctionAnyOf(v);
}

export function isPolicyCondition(v: any): v is PolicyCondition {
   return isPolicyConditionMatcher(v) || isPolicyConditionConjunction(v);
}

/**
 * Policies define what actions a subject is allowed to perform.
 */
export interface Policy {

   /**
    * Does this policy allow an action, or disallow (deny) it?
    */
   effect: PolicyEffect;

   /**
    * What action(s) are allowed or disallowed by this policy?
    */
   actions: readonly string[];

   /**
    * On which resource(s) does this policy grant (or deny) permission to perform those
    * actions?
    */
   resources: readonly string[];

   /**
    * Are there any conditions that must apply to the contextual data about the action for
    * this policy to be used?
    */
   conditions?: PolicyCondition[];
}


/**
 * Externally, policies do not require an ID. But internally in FSABA, an ID is assigned
 * to policies once the policy is customized to the subject's role claims.
 */
export interface PolicyWithID extends Policy {

   /**
    * FSABA generates a policy ID from the subject ID, role ID, and context value that
    * generated the policy for the subject.
    */
   policyID: string;

}


/**
 * A role aggregates multiple policies under a single named entity.
 */
export interface RoleDefinition {

   /**
    * The ID of the role. Users will have claims that grant them access to specific roles
    * by the role ID.
    */
   roleID: string;

   /**
    * The policies this role includes.
    */
   policies: readonly Policy[];
}


/**
 * Users (or subjects) will have specific roles assigned to them. Along with each role
 * assignment, there may be a context value to provide additional information about the
 * limits of that role assignment. For example, if a user is assigned a role
 * "administer-account-for-other-user", the context value may be either the account number
 * that the user is allowed to administer, or it may be the other user's user ID if the
 * role grants permission to administer all accounts for the other user. A placeholder can
 * be placed in policy actions, resources, and conditions to indicate where this context
 * value will go in the policy; thus, each role should clearly document what the context
 * value is expected to be for that role, because it's the role (and its policies) that
 * decides how the context value is used.
 */
export interface RoleClaim {

   /**
    * The ID of the role the user has.
    */
   roleID: string;

   /**
    * Optionally, a context value.
    */
   contextValue?: any;
}

/**
 * A set of claims represents what a user is allowed to do.
 */
export interface Claims {

   /**
    * The subject ID is the value used to identify a user in your system. This can be any
    * string value that you use to identify users.
    */
   subjectID: string;

   /**
    * Role claims grant a user access to roles, and are thus used to build the complete
    * policyset by which the user's permissions are evaluated.
    */
   roles: readonly RoleClaim[];
}

/**
 * An authorizer factory is pre-loaded with all of the necessary roles known to the
 * system. When `makeAuthorizerForSubject` is called, the subject's claims are used to
 * create a subject authorizer for determining what the subject can and can't do.
 */
export interface IAuthorizerFactory {

   /**
    * Using the subject's claims and the system roles this factory is aware of, make a
    * subject authorizer for this subject.
    */
   makeAuthorizerForSubject(claims: Claims): ISubjectAuthorizer;

}

/**
 * Options passed when calling `isAllowed` on an `ISubjectAuthorizer`.
 */
export interface IsAllowedOpts {
   context: StringMap;

   /**
    * When true, policy conditions are bypassed, only action and resource patterns are
    * evaluated. Useful for UI scenarios where you need to know if a user *could* have
    * access to an action (e.g., showing a button) before the runtime context required by
    * conditions is available.
    */
   ignoreConditions: boolean;
}

export interface HasPolicyGrantingOpts {

   /**
    * An optional resource prefix pattern (e.g. 'budgets:kazoo/*'). If provided, the
    * authorizer checks if any policy grants the action on a resource that matches this
    * prefix.
    *
    * Note: This must end with a wildcard (`*`) and cannot contain wildcards elsewhere.
    */
   resourcePrefixPattern?: string;
}

/**
 * A subject authorizer is used to determine what actions each subject can perform.
 */
export interface ISubjectAuthorizer {

   /**
    * Is the subject allowed to perform this action on the given resource? Optionally,
    * provide a context that may be evaluated by policy conditions. In rare cases, you may
    * want to ignore conditions when determining if the user would have access to an
    * action—for example, to decide whether to render a UI element before runtime context
    * is available.
    */
   isAllowed(action: string, resource: string, opts?: Partial<IsAllowedOpts>): boolean;

   /**
    * Perform an early check to see if the user has a policy allowing them to perform the
    * provided action at all, with an optional resource prefix. This is useful for APIs to
    * perform an early check before doing expensive processing to load any data needed to
    * determine if the user has access to perform the action.
    *
    * This does not replace the need to call `isAllowed` to determine if the user has
    * access to perform the action. This is a tool that can be used to reduce the
    * information disclosed (e.g. via timing-based probing) to users who don't have access
    * to perform an action at all.
    *
    * Scenario: A request is made for `budgets/it-dept/fy2025/q1`. Your code needs to:
    * (1) validate query params, and (2) load the IT Department budget for Q1 of FY2025
    * to see who has permission to view it (before an `isAllowed` call could be made). If
    * the query params seem invalid, or if there is no budget for those params, you'd
    * return a "Bad Request" or "Not Found" response. But, if the user doesn't have
    * `budget:View` for any combination of departments, etc, then there's no reason to
    * even perform those steps and potentially expose information through the "Bad
    * Request" or "Not Found" responses.
    *
    * Using this method, you could follow this flow:
    *
    *    1. hasPolicyGranting('budget:View') - if they don't have this, then stop right
    *       there; if they do have a policy granting them view rights to a budget, they
    *       might not be for this budget, but you can now continue your flow
    *    2. Validate query params; may be okay to return Bad Response depending on your
    *       security requirements
    *    3. Look up the requested budget; may or may not be okay to return a 404 Not Found
    *       depending on your security requirements
    *    4. If you did find that budget item, now, check if they have permission to view
    *       this budget with isAllowed
    *
    * In pseudocode, this might look like:
    *
    * ```
    * // A request is made for budgets/it-dept/fy2025/q1.
    * // 1. Check if the user has ANY policy granting 'budget:View'
    * if (!authorizer.hasPolicyGranting('budget:View')) {
    *    return 403 Forbidden;
    * }
    *
    * // 2. Validate query params
    * if (!params.isValid()) {
    *    // Possibly safe to let the user know the request is invalid because we know
    *    // they have SOME view rights
    *    return 400 Bad Request;
    * }
    *
    * // 3. Load the specific resource
    * const budget = await loadBudget('it-dept', 'fy2025', 'q1');
    *
    * if (!budget) {
    *    // Returning a 403 Forbidden vs 404 Not Found here depends on your security
    *    // requirements.
    *    return 403 Forbidden;
    * }
    *
    * // 4. Perform final check for this specific budget
    * if (!authorizer.isAllowed('budget:View', budget.id, { context: budget.context })) {
    *    return 403 Forbidden;
    * }
    *
    * return 200 OK;
    * ```
    */
   hasPolicyGranting(action: string, opts?: HasPolicyGrantingOpts): boolean;

}

/**
 * Options determining how the subject authorizer is created.
 */
export interface ISubjectAuthorizerOpts {

   /**
    * If the user has claims to a role that's not known to the authorizer, should an error
    * be thrown? (Defaults to false)
    */
   throwOnUnknownRole: boolean;

}
