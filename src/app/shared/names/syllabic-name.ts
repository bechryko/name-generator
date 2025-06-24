import { RegularString } from "@ngen-shared/models";

export interface SyllabicName {
   name: string;
   regularBase: RegularString;
   syllabic: string[];
   regularSyllabic: RegularString[];
}
