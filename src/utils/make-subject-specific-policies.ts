import {
   isPolicyConditionConjunctionAllOf,
   isPolicyConditionConjunctionAnyOf,
   isPolicyConditionMatcher,
   PolicyCondition,
   PolicyWithID,
   RoleClaim,
   RoleDefinition,
} from '../fsaba-types';
import substituteValues from './substitute-values';

export default function makeSubjectSpecificPolicies(subjectID: string, claim: RoleClaim, role: RoleDefinition): PolicyWithID[] {
   if (claim.roleID !== role.roleID) {
      throw new Error(`Claim is for role "${claim.roleID}" but role is "${role.roleID}"`);
   }

   const replaceTokens = substituteValues.bind(null, { subjectID, contextValue: claim.contextValue }, role.roleID);

   return role.policies.map((p, i) => {
      const policy: PolicyWithID = {
         policyID: makePolicyID(subjectID, role.roleID, i, claim.contextValue),
         effect: p.effect,
         actions: p.actions.map(replaceTokens),
         resources: p.resources.map(replaceTokens),
         conditions: p.conditions?.map(makeSubjectConditions.bind(null, replaceTokens)),
      };

      return policy;
   });
}

/**
 * Clones a policy condition (deeply, including all conjunctions and matchers), and
 * replaces tokens in each matchers' `value` with the provided replacer.
 *
 * @param tokenReplacer function to replace tokens in the `value` field of any matchers
 * within this condition
 * @param cond the original policy condition
 * @returns
 */
function makeSubjectConditions(tokenReplacer: (s: string) => string, cond: Readonly<PolicyCondition>): PolicyCondition {
   /* istanbul ignore else */
   if (isPolicyConditionMatcher(cond)) {
      return {
         field: cond.field,
         type: cond.type,
         value: tokenReplacer(cond.value),
      };
   } else if (isPolicyConditionConjunctionAllOf(cond)) {
      return {
         allOf: cond.allOf.map((c) => { return makeSubjectConditions(tokenReplacer, c); }),
      };
   } else if (isPolicyConditionConjunctionAnyOf(cond)) {
      return {
         anyOf: cond.anyOf.map((c) => { return makeSubjectConditions(tokenReplacer, c); }),
      };
   }

   /* istanbul ignore next */
   throw new Error(`Unreachable: ${typeof cond} (${Object.getOwnPropertyNames(cond)})`);
}

function makePolicyID(subjectID: string, roleID: string, policyIndex: number, contextValue?: string): string {
   const parts = [ `${roleID}[${policyIndex}]`, subjectID ];

   if (contextValue) {
      parts.push(contextValue);
   }

   return parts.join('|');
}
