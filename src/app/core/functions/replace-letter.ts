export function replaceLetter(input: string, index: number, replacement: string): string {
   return input.substring(0, index) + replacement + input.substring(index + 1);
}
