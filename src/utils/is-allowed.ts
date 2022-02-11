import { IsAllowedOpts, Policy, PolicyWithID } from '..';
import allConditionsSatisfied from './conditions-match';
import stringMatchesPattern from './string-matches-pattern';

export default function isAllowed(policies: { deny: readonly PolicyWithID[]; allow: readonly PolicyWithID[] }, action: string, resource: string, opts?: Partial<IsAllowedOpts>): boolean { // eslint-disable-line max-len
   const isDenied = policies.deny.reduce((memo, policy) => {
      return memo || policyMatches(policy, action, resource, opts);
   }, false);

   if (isDenied) {
      return false;
   }

   return !!policies.allow.reduce((memo, policy) => {
      return memo || policyMatches(policy, action, resource, opts);
   }, false as boolean);
}

function policyMatches(policy: Omit<Policy, 'effect'>, action: string, resource: string, opts?: Partial<IsAllowedOpts>): boolean {
   return stringMatchesAnyOfMultiplePatterns(policy.actions, action)
      && stringMatchesAnyOfMultiplePatterns(policy.resources, resource)
      && (opts?.ignoreConditions || allConditionsSatisfied(policy.conditions, opts?.context));
}

function stringMatchesAnyOfMultiplePatterns(patterns: readonly string[], value: string): boolean {
   return patterns.reduce((memo, pattern) => {
      return memo || stringMatchesPattern(pattern, value);
   }, false as boolean);
}
