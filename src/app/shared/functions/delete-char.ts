export function deleteChar(str: string, position: number): string {
   if (position < 0 || position >= str.length) {
      return str;
   }

   let result = str.substring(0, position);
   if (position !== str.length - 1) {
      result += str.substring(position + 1);
   }

   return result;
}
