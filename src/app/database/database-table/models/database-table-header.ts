export interface DatabaseTableHeader<T> {
   label: string;
   key: keyof T;
   enableSort: boolean;
}
