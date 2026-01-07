import { expect } from 'chai';
import { AuthorizerFactory } from '../src';
import {
   VIEW_BUDGET,
   BUDGET_VIEWER_SINGLE,
   BUDGET_VIEWER_MFG_HEAD,
   BUDGET_VIEWER_KAZOO_PM,
   BUDGET_VIEWER_ACCOUNTING_HEAD,
} from './sample-data';

describe('Multi-dimensional context authorization', () => {
   const factory = new AuthorizerFactory([ VIEW_BUDGET ]),
         mockBudget = 'budget:f47ac10b-58cc-4372-a567-0e02b2c3d479';

   describe('BUDGET_VIEWER_SINGLE (kazoo manufacturing only)', () => {
      const authorizer = factory.makeAuthorizerForSubject(BUDGET_VIEWER_SINGLE);

      it('allows viewing kazoo manufacturing budget', () => {
         const allowed = authorizer.isAllowed('budget:View', mockBudget, {
            context: { 'budget:OwningDepartment': 'manufacturing', 'budget:ProductLine': 'kazoo' },
         });

         expect(allowed).to.strictlyEqual(true);
      });

      it('denies viewing rubber-duck manufacturing budget', () => {
         const allowed = authorizer.isAllowed('budget:View', mockBudget, {
            context: { 'budget:OwningDepartment': 'manufacturing', 'budget:ProductLine': 'rubber-duck' },
         });

         expect(allowed).to.strictlyEqual(false);
      });

      it('denies viewing kazoo marketing budget', () => {
         const allowed = authorizer.isAllowed('budget:View', mockBudget, {
            context: { 'budget:OwningDepartment': 'marketing', 'budget:ProductLine': 'kazoo' },
         });

         expect(allowed).to.strictlyEqual(false);
      });
   });

   describe('BUDGET_VIEWER_MFG_HEAD (all products in manufacturing)', () => {
      const authorizer = factory.makeAuthorizerForSubject(BUDGET_VIEWER_MFG_HEAD);

      it('allows viewing kazoo manufacturing budget', () => {
         const allowed = authorizer.isAllowed('budget:View', mockBudget, {
            context: { 'budget:OwningDepartment': 'manufacturing', 'budget:ProductLine': 'kazoo' },
         });

         expect(allowed).to.strictlyEqual(true);
      });

      it('allows viewing rubber-duck manufacturing budget', () => {
         const allowed = authorizer.isAllowed('budget:View', mockBudget, {
            context: { 'budget:OwningDepartment': 'manufacturing', 'budget:ProductLine': 'rubber-duck' },
         });

         expect(allowed).to.strictlyEqual(true);
      });

      it('denies viewing kazoo marketing budget', () => {
         const allowed = authorizer.isAllowed('budget:View', mockBudget, {
            context: { 'budget:OwningDepartment': 'marketing', 'budget:ProductLine': 'kazoo' },
         });

         expect(allowed).to.strictlyEqual(false);
      });
   });

   describe('BUDGET_VIEWER_KAZOO_PM (kazoo across departments)', () => {
      const authorizer = factory.makeAuthorizerForSubject(BUDGET_VIEWER_KAZOO_PM);

      it('allows viewing kazoo manufacturing budget', () => {
         const allowed = authorizer.isAllowed('budget:View', mockBudget, {
            context: { 'budget:OwningDepartment': 'manufacturing', 'budget:ProductLine': 'kazoo' },
         });

         expect(allowed).to.strictlyEqual(true);
      });

      it('allows viewing kazoo marketing budget', () => {
         const allowed = authorizer.isAllowed('budget:View', mockBudget, {
            context: { 'budget:OwningDepartment': 'marketing', 'budget:ProductLine': 'kazoo' },
         });

         expect(allowed).to.strictlyEqual(true);
      });

      it('denies viewing rubber-duck manufacturing budget', () => {
         const allowed = authorizer.isAllowed('budget:View', mockBudget, {
            context: { 'budget:OwningDepartment': 'manufacturing', 'budget:ProductLine': 'rubber-duck' },
         });

         expect(allowed).to.strictlyEqual(false);
      });
   });

   describe('BUDGET_VIEWER_ACCOUNTING_HEAD (manufacturing + marketing + office)', () => {
      const authorizer = factory.makeAuthorizerForSubject(BUDGET_VIEWER_ACCOUNTING_HEAD);

      it('allows viewing kazoo manufacturing budget', () => {
         const allowed = authorizer.isAllowed('budget:View', mockBudget, {
            context: { 'budget:OwningDepartment': 'manufacturing', 'budget:ProductLine': 'kazoo' },
         });

         expect(allowed).to.strictlyEqual(true);
      });

      it('allows viewing rubber-duck marketing budget', () => {
         const allowed = authorizer.isAllowed('budget:View', mockBudget, {
            context: { 'budget:OwningDepartment': 'marketing', 'budget:ProductLine': 'rubber-duck' },
         });

         expect(allowed).to.strictlyEqual(true);
      });

      it('allows viewing any office budget (wildcard product)', () => {
         const supplies = authorizer.isAllowed('budget:View', mockBudget, {
            context: { 'budget:OwningDepartment': 'office', 'budget:ProductLine': 'supplies' },
         });

         const equipment = authorizer.isAllowed('budget:View', mockBudget, {
            context: { 'budget:OwningDepartment': 'office', 'budget:ProductLine': 'equipment' },
         });

         expect(supplies).to.strictlyEqual(true);

         expect(equipment).to.strictlyEqual(true);
      });

      it('denies viewing HR department budget', () => {
         const allowed = authorizer.isAllowed('budget:View', mockBudget, {
            context: { 'budget:OwningDepartment': 'hr', 'budget:ProductLine': 'kazoo' },
         });

         expect(allowed).to.strictlyEqual(false);
      });
   });
});
