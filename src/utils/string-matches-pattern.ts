export default function stringMatchesPattern(pattern: string, value: string): boolean {
   if (pattern.indexOf('*') === -1) {
      // Short-circuit to avoid overhead of RegExp creation when not needed.
      return pattern === value;
   }

   return new RegExp('^' + _convertPatternToRegExpString(pattern) + '$').test(value);
}

function escapeRegExpCharacters(s: string): string {
   // See
   // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
   return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * ONLY EXPORTED FOR TESTING
 */
export function _convertPatternToRegExpString(pattern: string): string {
   return pattern
      .split(/\*+/)
      .map((part) => {
         // An empty part happens when a wildcard is at the beginning or end of the
         // string. We leave it empty so that the wildcard will get placed by the `.join`
         return part === '' ? '' : escapeRegExpCharacters(part);
      })
      .join('.+');
}
