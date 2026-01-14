import { hasDefined, isString, isStringMap, StringMap } from '@silvermine/toolbox';

export interface KnownTokenValues {
   subjectID: string;
   contextValue?: string | StringMap;
}

const CONTEXT_VALUE_REGEX = /{CONTEXT_VALUE(?::([^}]+))?}/g;

export default function substituteValues(vals: KnownTokenValues, roleID: string, input: string): string {
   const result = input.replace(/{SUBJECT_ID}/g, vals.subjectID);

   return result.replace(CONTEXT_VALUE_REGEX, (_match: string, key?: string) => {
      if (vals.contextValue === undefined) {
         throw new Error(`Role "${roleID}" depends on a context value, but none was supplied`);
      }

      if (key === undefined) {
         if (!isString(vals.contextValue)) {
            throw new Error(`Role "${roleID}" uses {CONTEXT_VALUE} but contextValue is not a string`);
         }
         return vals.contextValue;
      }

      if (!isStringMap(vals.contextValue)) {
         throw new Error(`Role "${roleID}" uses {CONTEXT_VALUE:key} but contextValue is not a StringMap`);
      }

      if (!hasDefined(vals.contextValue, key)) {
         throw new Error(`Role "${roleID}" references context key "${key}" but it was not provided`);
      }

      return vals.contextValue[key];
   });
}
