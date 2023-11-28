import { GeneratedName } from "@ngen-database/models";

export interface NameDatabaseTableHeader {
   label: string;
   key: keyof GeneratedName;
   enableSort: boolean;
}
