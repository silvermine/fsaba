export interface KnownTokenValues {
   subjectID: string;
   contextValue?: string;
}

export default function substituteValues(vals: KnownTokenValues, roleID: string, input: string): string {
   let v = input;

   v = v.replace(/{SUBJECT_ID}/g, vals.subjectID);

   if (vals.contextValue) {
      v = v.replace(/{CONTEXT_VALUE}/g, vals.contextValue);
   } else if (/{CONTEXT_VALUE}/.test(v)) {
      throw new Error(`Role "${roleID}" depends on a context value, but none was supplied`);
   }

   return v;
}
