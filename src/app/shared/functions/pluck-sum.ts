export function pluckSum<K extends string, T extends Record<K, number>>(array: T[], key: K): number {
   return array.reduce((acc, current) => acc + current[key], 0);
}
