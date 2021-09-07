import { expect } from 'chai';
import substituteValues from '../../src/utils/substitute-values';

describe('substituteValues', () => {
   it('throws an error when CONTEXT_VALUE not supplied', () => {
      expect(() => { substituteValues({ subjectID: 'foo' }, 'some-role', 'some:{CONTEXT_VALUE}'); })
         .to
         .throw('Role "some-role" depends on a context value, but none was supplied');
   });
});
