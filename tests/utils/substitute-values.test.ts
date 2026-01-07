import { expect } from 'chai';
import substituteValues from '../../src/utils/substitute-values';

describe('substituteValues', () => {

   describe('simple {CONTEXT_VALUE}', () => {
      it('replaces CONTEXT_VALUE with string contextValue', () => {
         const result = substituteValues({ subjectID: 'user1', contextValue: 'foo' }, 'role', 'resource:{CONTEXT_VALUE}');

         expect(result).to.strictlyEqual('resource:foo');
      });

      it('throws when contextValue is object but simple placeholder used', () => {
         expect(() => { substituteValues({ subjectID: 'user1', contextValue: { a: 'x' } }, 'role', 'resource:{CONTEXT_VALUE}'); })
            .to
            .throw('Role "role" uses {CONTEXT_VALUE} but contextValue is not a string');
      });

      it('throws an error when CONTEXT_VALUE not supplied', () => {
         expect(() => { substituteValues({ subjectID: 'foo' }, 'some-role', 'some:{CONTEXT_VALUE}'); })
            .to
            .throw('Role "some-role" depends on a context value, but none was supplied');
      });
   });

   describe('keyed {CONTEXT_VALUE:key}', () => {
      it('extracts key from object contextValue', () => {
         const result = substituteValues(
            { subjectID: 'user1', contextValue: { product: 'kazoo', department: 'mfg' } },
            'role',
            'budget:{CONTEXT_VALUE:department}:{CONTEXT_VALUE:product}'
         );

         expect(result).to.strictlyEqual('budget:mfg:kazoo');
      });

      it('throws when contextValue is string but keyed placeholder used', () => {
         expect(() => { substituteValues({ subjectID: 'user1', contextValue: 'foo' }, 'role', 'resource:{CONTEXT_VALUE:key}'); })
            .to
            .throw('Role "role" uses {CONTEXT_VALUE:key} but contextValue is not a StringMap');
      });

      it('throws when referenced key does not exist', () => {
         expect(() => { substituteValues({ subjectID: 'user1', contextValue: { a: 'x' } }, 'role', 'resource:{CONTEXT_VALUE:missing}'); })
            .to
            .throw('Role "role" references context key "missing" but it was not provided');
      });

      it('throws when contextValue not supplied', () => {
         expect(() => { substituteValues({ subjectID: 'user1' }, 'role', 'resource:{CONTEXT_VALUE:key}'); })
            .to
            .throw('Role "role" depends on a context value, but none was supplied');
      });
   });

   describe('SUBJECT_ID', () => {
      it('replaces SUBJECT_ID', () => {
         const result = substituteValues({ subjectID: 'user123' }, 'role', 'auth:principals/{SUBJECT_ID}');

         expect(result).to.strictlyEqual('auth:principals/user123');
      });
   });

});
