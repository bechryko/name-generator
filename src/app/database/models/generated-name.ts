import { Generators } from "@ngen-generation/enums";

export interface GeneratedName {
   name: string;
   generationAlgorithm: Generators;
   version: string;
}
