import { expect } from 'chai';
import { AuthorizerFactory } from '../src';
import {
   VIEW_BUDGET,
   BUDGET_VIEWER_SINGLE,
   BUDGET_VIEWER_MFG_HEAD,
   BUDGET_VIEWER_KAZOO_PM,
   BUDGET_VIEWER_ACCOUNTING_HEAD,
   VIEW_NON_CONFIDENTIAL_BLUEPRINTS,
   VIEW_ALL_BLUEPRINTS,
   BLUEPRINT_VIEWER_ENGINEERING,
   BLUEPRINT_VIEWER_ENGINEERING_ALL,
   BLUEPRINT_VIEWER_MULTI_DEPT,
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

describe('Multi-dimensional IfExists conditions', () => {
   const blueprintFactory = new AuthorizerFactory([ VIEW_NON_CONFIDENTIAL_BLUEPRINTS, VIEW_ALL_BLUEPRINTS ]),
         mockBlueprint = 'blueprints:a1b2c3d4-e5f6-7890-abcd-ef1234567890';

   describe('BLUEPRINT_VIEWER_ENGINEERING (non-confidential only via StringDoesNotMatchIfExists)', () => {
      const authorizer = blueprintFactory.makeAuthorizerForSubject(BLUEPRINT_VIEWER_ENGINEERING);

      it('allows viewing engineering blueprint with no classification (field missing)', () => {
         const allowed = authorizer.isAllowed('blueprints:View', mockBlueprint, {
            context: { 'blueprints:OwningDepartment': 'engineering' },
         });

         expect(allowed).to.strictlyEqual(true);
      });

      it('allows viewing engineering blueprint classified as public', () => {
         const allowed = authorizer.isAllowed('blueprints:View', mockBlueprint, {
            context: { 'blueprints:OwningDepartment': 'engineering', 'blueprints:Classification': 'public' },
         });

         expect(allowed).to.strictlyEqual(true);
      });

      it('denies viewing engineering blueprint classified as confidential', () => {
         const allowed = authorizer.isAllowed('blueprints:View', mockBlueprint, {
            context: { 'blueprints:OwningDepartment': 'engineering', 'blueprints:Classification': 'confidential' },
         });

         expect(allowed).to.strictlyEqual(false);
      });

      it('denies viewing manufacturing blueprint (wrong department)', () => {
         const allowed = authorizer.isAllowed('blueprints:View', mockBlueprint, {
            context: { 'blueprints:OwningDepartment': 'manufacturing', 'blueprints:Classification': 'public' },
         });

         expect(allowed).to.strictlyEqual(false);
      });
   });

   describe('BLUEPRINT_VIEWER_ENGINEERING_ALL (all blueprints including confidential)', () => {
      const authorizer = blueprintFactory.makeAuthorizerForSubject(BLUEPRINT_VIEWER_ENGINEERING_ALL);

      it('allows viewing engineering blueprint with no classification', () => {
         const allowed = authorizer.isAllowed('blueprints:View', mockBlueprint, {
            context: { 'blueprints:OwningDepartment': 'engineering' },
         });

         expect(allowed).to.strictlyEqual(true);
      });

      it('allows viewing engineering blueprint classified as public', () => {
         const allowed = authorizer.isAllowed('blueprints:View', mockBlueprint, {
            context: { 'blueprints:OwningDepartment': 'engineering', 'blueprints:Classification': 'public' },
         });

         expect(allowed).to.strictlyEqual(true);
      });

      it('allows viewing engineering blueprint classified as confidential', () => {
         const allowed = authorizer.isAllowed('blueprints:View', mockBlueprint, {
            context: { 'blueprints:OwningDepartment': 'engineering', 'blueprints:Classification': 'confidential' },
         });

         expect(allowed).to.strictlyEqual(true);
      });

      it('denies viewing manufacturing blueprint (wrong department)', () => {
         const allowed = authorizer.isAllowed('blueprints:View', mockBlueprint, {
            context: { 'blueprints:OwningDepartment': 'manufacturing', 'blueprints:Classification': 'public' },
         });

         expect(allowed).to.strictlyEqual(false);
      });
   });

   describe('BLUEPRINT_VIEWER_MULTI_DEPT (non-confidential across engineering + manufacturing)', () => {
      const authorizer = blueprintFactory.makeAuthorizerForSubject(BLUEPRINT_VIEWER_MULTI_DEPT);

      it('allows viewing engineering blueprint with no classification', () => {
         const allowed = authorizer.isAllowed('blueprints:View', mockBlueprint, {
            context: { 'blueprints:OwningDepartment': 'engineering' },
         });

         expect(allowed).to.strictlyEqual(true);
      });

      it('allows viewing manufacturing blueprint with no classification', () => {
         const allowed = authorizer.isAllowed('blueprints:View', mockBlueprint, {
            context: { 'blueprints:OwningDepartment': 'manufacturing' },
         });

         expect(allowed).to.strictlyEqual(true);
      });

      it('allows viewing engineering blueprint classified as internal', () => {
         const allowed = authorizer.isAllowed('blueprints:View', mockBlueprint, {
            context: { 'blueprints:OwningDepartment': 'engineering', 'blueprints:Classification': 'internal' },
         });

         expect(allowed).to.strictlyEqual(true);
      });

      it('denies viewing engineering confidential blueprint', () => {
         const allowed = authorizer.isAllowed('blueprints:View', mockBlueprint, {
            context: { 'blueprints:OwningDepartment': 'engineering', 'blueprints:Classification': 'confidential' },
         });

         expect(allowed).to.strictlyEqual(false);
      });

      it('denies viewing manufacturing confidential blueprint', () => {
         const allowed = authorizer.isAllowed('blueprints:View', mockBlueprint, {
            context: { 'blueprints:OwningDepartment': 'manufacturing', 'blueprints:Classification': 'confidential' },
         });

         expect(allowed).to.strictlyEqual(false);
      });

      it('denies viewing HR blueprint (unauthorized department)', () => {
         const allowed = authorizer.isAllowed('blueprints:View', mockBlueprint, {
            context: { 'blueprints:OwningDepartment': 'hr', 'blueprints:Classification': 'public' },
         });

         expect(allowed).to.strictlyEqual(false);
      });
   });
});
