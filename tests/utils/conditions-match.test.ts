import { expect } from 'chai';
import { matcherSatisfied } from '../../src/utils/conditions-match';
import { PolicyConditionMatchType } from '../../src/fsaba-types';

describe('matcherSatisfied', () => {
   it('returns false on invalid matcher type', () => {
      expect(matcherSatisfied({ type: 'foo' } as any, {})).to.eql(false);
   });

   describe('StringMatches', () => {
      it('returns false when field is missing from context', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringMatches,
            field: 'department',
            value: 'manufacturing',
         };

         const context = { product: 'kazoo' };

         expect(matcherSatisfied(matcher, context)).to.strictlyEqual(false);
      });

      it('returns true when field is missing from context and the value is a wildcard', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringMatches,
            field: 'department',
            value: '*',
         };

         const context = { product: 'kazoo' };

         expect(matcherSatisfied(matcher, context)).to.strictlyEqual(true);
      });

      it('returns true when field is present and matches', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringMatches,
            field: 'department',
            value: 'manufacturing',
         };

         const context = { department: 'manufacturing' };

         expect(matcherSatisfied(matcher, context)).to.strictlyEqual(true);
      });

      it('returns false when field is present and does not match', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringMatches,
            field: 'department',
            value: 'manufacturing',
         };

         const context = { department: 'marketing' };

         expect(matcherSatisfied(matcher, context)).to.strictlyEqual(false);
      });

      it('returns true when field is present and matches a wildcard value', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringMatches,
            field: 'department',
            value: 'manu*',
         };

         const context = { department: 'manufacturing' };

         expect(matcherSatisfied(matcher, context)).to.strictlyEqual(true);
      });

      it('returns false when field is present and does not match a wildcard value', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringMatches,
            field: 'department',
            value: 'manu*',
         };

         const context = { department: 'marketing' };

         expect(matcherSatisfied(matcher, context)).to.strictlyEqual(false);
      });
   });

   describe('StringDoesNotMatch', () => {
      it('returns true when field is missing from context', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringDoesNotMatch,
            field: 'department',
            value: 'manufacturing',
         };

         const context = { product: 'kazoo' };

         expect(matcherSatisfied(matcher, context)).to.strictlyEqual(true);
      });

      it('returns false when field is missing from context and the value is a wildcard', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringDoesNotMatch,
            field: 'department',
            value: '*',
         };

         const context = { product: 'kazoo' };

         expect(matcherSatisfied(matcher, context)).to.strictlyEqual(false);
      });

      it('returns false when field is present and matches', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringDoesNotMatch,
            field: 'department',
            value: 'manufacturing',
         };

         const context = { department: 'manufacturing' };

         expect(matcherSatisfied(matcher, context)).to.strictlyEqual(false);
      });

      it('returns true when field is present and does not match', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringDoesNotMatch,
            field: 'department',
            value: 'marketing',
         };

         const context = { department: 'manufacturing' };

         expect(matcherSatisfied(matcher, context)).to.strictlyEqual(true);
      });

      it('returns false when field is present and matches a wildcard value', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringDoesNotMatch,
            field: 'department',
            value: 'manu*',
         };

         const context = { department: 'manufacturing' };

         expect(matcherSatisfied(matcher, context)).to.strictlyEqual(false);
      });

      it('returns true when field is present and does not match a wildcard value', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringDoesNotMatch,
            field: 'department',
            value: 'manu*',
         };

         const context = { department: 'marketing' };

         expect(matcherSatisfied(matcher, context)).to.strictlyEqual(true);
      });
   });

   describe('StringMatchesIfExists', () => {
      it('returns true when field is missing from context', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringMatchesIfExists,
            field: 'department',
            value: 'manufacturing',
         };

         const context = { product: 'kazoo' };

         expect(matcherSatisfied(matcher, context)).to.eql(true);
      });

      it('returns true when field is missing from context and the value is a wildcard', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringMatchesIfExists,
            field: 'department',
            value: '*',
         };

         const context = { product: 'kazoo' };

         expect(matcherSatisfied(matcher, context)).to.strictlyEqual(true);
      });

      it('returns true when field is present and matches', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringMatchesIfExists,
            field: 'department',
            value: 'manufacturing',
         };

         const context = { department: 'manufacturing' };

         expect(matcherSatisfied(matcher, context)).to.eql(true);
      });

      it('returns false when field is present and does not match', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringMatchesIfExists,
            field: 'department',
            value: 'manufacturing',
         };

         const context = { department: 'marketing' };

         expect(matcherSatisfied(matcher, context)).to.eql(false);
      });

      it('returns true when field is present and matches a wildcard value', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringMatchesIfExists,
            field: 'department',
            value: 'manu*',
         };

         const context = { department: 'manufacturing' };

         expect(matcherSatisfied(matcher, context)).to.strictlyEqual(true);
      });

      it('returns false when field is present and does not match a wildcard value', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringMatchesIfExists,
            field: 'department',
            value: 'manu*',
         };

         const context = { department: 'marketing' };

         expect(matcherSatisfied(matcher, context)).to.strictlyEqual(false);
      });
   });

   describe('StringDoesNotMatchIfExists', () => {
      it('returns true when field is missing from context', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringDoesNotMatchIfExists,
            field: 'department',
            value: 'manufacturing',
         };

         const context = { product: 'kazoo' };

         expect(matcherSatisfied(matcher, context)).to.eql(true);
      });

      it('returns true when field is missing from context and the value is a wildcard', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringDoesNotMatchIfExists,
            field: 'department',
            value: '*',
         };

         const context = { product: 'kazoo' };

         expect(matcherSatisfied(matcher, context)).to.strictlyEqual(true);
      });

      it('returns false when field is present and matches pattern', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringDoesNotMatchIfExists,
            field: 'department',
            value: 'manufacturing',
         };

         const context = { department: 'manufacturing' };

         expect(matcherSatisfied(matcher, context)).to.eql(false);
      });

      it('returns true when field is present and does not match', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringDoesNotMatchIfExists,
            field: 'department',
            value: 'manufacturing',
         };

         const context = { department: 'marketing' };

         expect(matcherSatisfied(matcher, context)).to.eql(true);
      });

      it('returns false when field is present and matches a wildcard value', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringDoesNotMatchIfExists,
            field: 'department',
            value: 'manu*',
         };

         const context = { department: 'manufacturing' };

         expect(matcherSatisfied(matcher, context)).to.strictlyEqual(false);
      });

      it('returns true when field is present and does not match a wildcard value', () => {
         const matcher = {
            type: PolicyConditionMatchType.StringDoesNotMatchIfExists,
            field: 'department',
            value: 'manu*',
         };

         const context = { department: 'marketing' };

         expect(matcherSatisfied(matcher, context)).to.strictlyEqual(true);
      });
   });
});
