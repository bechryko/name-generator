import { NgenArray } from "@ngen-core/models";

export interface SyllabicName {
    name: string;
    regularBase: string;
    syllabic: string[];
    regularSyllabic: NgenArray<string>; 
}
