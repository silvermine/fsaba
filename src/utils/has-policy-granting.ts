import { HasPolicyGrantingOpts, PolicyWithID } from '../fsaba-types';
import stringMatchesPattern from './string-matches-pattern';

/**
 * Perform an early check to see if the user has a policy to perform an action at all,
 * with an optional resource prefix.
 */
export default function hasPolicyGranting(policies: { allow: readonly PolicyWithID[] }, action: string, opts?: HasPolicyGrantingOpts): boolean {
   return policies.allow.some((policy) => {
      const actionMatches = policy.actions.some((policyAction) => {
         return stringMatchesPattern(policyAction, action);
      });

      if (!actionMatches) {
         return false;
      }

      const resourcePrefixPattern = opts?.resourcePrefixPattern;

      if (!resourcePrefixPattern) {
         return true;
      }

      if (!resourcePrefixPattern.endsWith('*') || resourcePrefixPattern.indexOf('*') !== resourcePrefixPattern.length - 1) {
         throw new Error('resourcePrefixPattern must end with a wildcard and cannot contain wildcards elsewhere');
      }

      const prefix = resourcePrefixPattern.slice(0, -1);

      return policy.resources.some((policyResource) => {
         return stringMatchesPattern(policyResource, resourcePrefixPattern)
            || policyResource.startsWith(prefix);
      });
   });
}
