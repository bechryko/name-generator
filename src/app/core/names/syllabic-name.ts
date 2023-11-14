import { NgenArray } from "@ngen-core/models";
import { RegularName } from "./regular-name";

export interface SyllabicName extends RegularName {
    syllabic: string[];
    regularSyllabic: NgenArray<string>; 
}
