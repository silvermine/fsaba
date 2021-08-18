import { RoleDefinition, Claims, IAuthorizerFactory, ISubjectAuthorizerOpts } from './fsaba-types';
import { SubjectAuthorizer } from './SubjectAuthorizer';

export class AuthorizerFactory implements IAuthorizerFactory {

   private _allRoles: RoleDefinition[];

   public constructor(allRoles: RoleDefinition[]) {
      this._allRoles = allRoles;
   }

   public makeAuthorizerForSubject(claims: Claims, opts?: Partial<ISubjectAuthorizerOpts>): SubjectAuthorizer {
      return new SubjectAuthorizer(this._allRoles, claims, opts);
   }
}
