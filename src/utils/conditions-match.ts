import { StringMap } from '@silvermine/toolbox';
import { isPolicyConditionConjunctionAllOf, isPolicyConditionConjunctionAnyOf, isPolicyConditionMatcher, PolicyCondition } from '..';
import { PolicyConditionMatcher, PolicyConditionMatchType } from '../fsaba-types';
import stringMatchesPattern from './string-matches-pattern';

export default function allConditionsSatisfied(conditions?: PolicyCondition[], context?: StringMap): boolean {
   if (!conditions) {
      return true;
   }

   return !!conditions.reduce((memo, cond) => {
      return memo && singleConditionSatisfied(cond, context || {});
   }, true as boolean);
}

function singleConditionSatisfied(cond: PolicyCondition, context: StringMap): boolean {
   /* istanbul ignore else */
   if (isPolicyConditionMatcher(cond)) {
      return matcherSatisfied(cond, context);
   } else if (isPolicyConditionConjunctionAllOf(cond)) {
      return allConditionsSatisfied(cond.allOf, context);
   } else if (isPolicyConditionConjunctionAnyOf(cond)) {
      return !!cond.anyOf.find((subCondition) => {
         return singleConditionSatisfied(subCondition, context);
      });
   }

   /* istanbul ignore next */
   throw new Error(`Unreachable: ${typeof cond} (${Object.getOwnPropertyNames(cond)})`);
}

/**
 * EXPORTED ONLY FOR TESTING
 */
export function matcherSatisfied(matcher: PolicyConditionMatcher, context: StringMap): boolean {
   switch (matcher.type) {
      case PolicyConditionMatchType.StringMatches: {
         return stringMatchesPattern(matcher.value, context[matcher.field]);
      }
      case PolicyConditionMatchType.StringDoesNotMatch: {
         return !stringMatchesPattern(matcher.value, context[matcher.field]);
      }
      default: {
         return false;
      }
   }
}
