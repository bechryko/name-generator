import { RegularString } from "@ngen-core/models";

export interface SyllabicName {
   name: string;
   regularBase: RegularString;
   syllabic: string[];
   regularSyllabic: RegularString[];
}
