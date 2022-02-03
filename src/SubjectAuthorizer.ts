import { flatten } from '@silvermine/toolbox';
import {
   RoleDefinition,
   Claims,
   ISubjectAuthorizer,
   IsAllowedOpts,
   PolicyEffect,
   PolicyWithID,
   ISubjectAuthorizerOpts,
} from './fsaba-types';
import isAllowed from './utils/is-allowed';
import makeSubjectSpecificPolicies from './utils/make-subject-specific-policies';

export class SubjectAuthorizer implements ISubjectAuthorizer {

   private _policies: { deny: PolicyWithID[]; allow: PolicyWithID[] } = { deny: [], allow: [] };

   public constructor(allRoles: readonly RoleDefinition[], claims: Claims, opts?: Partial<ISubjectAuthorizerOpts>) {
      const policies = claims.roles
         .map((roleClaim) => {
            const role = allRoles.find((r) => { return r.roleID === roleClaim.roleID; });

            if (!role) {
               if (opts?.throwOnUnknownRole) {
                  throw new Error(`Subject "${claims.subjectID}" has claims to unknown role "${roleClaim.roleID}"`);
               }
               return [];
            }

            return makeSubjectSpecificPolicies(claims.subjectID, roleClaim, role);
         });

      flatten(...policies).forEach((p) => {
         if (p.effect === PolicyEffect.Allow) {
            this._policies.allow.push(p);
         } else {
            this._policies.deny.push(p);
         }
      });
   }

   public isAllowed(action: string, resource: string, opts?: Partial<IsAllowedOpts>): boolean {
      return isAllowed(this._policies, action, resource, opts);
   }

}
