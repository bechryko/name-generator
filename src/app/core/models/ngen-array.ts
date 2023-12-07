/**
 * Special array type with extended functionalities.
 */
export type NgenArray<T> = Array<T> & {
   /**
    * @returns the last element of the array
    */
   last(): T;
};
