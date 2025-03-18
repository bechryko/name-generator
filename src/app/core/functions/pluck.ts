export function pluck<T extends {}, K extends keyof T>(array: T[], key: K): T[K][] {
   return array.map((item) => item[key]);
}
