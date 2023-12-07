import { Generators } from "@ngen-generation/enums";

/**
 * Interface for the generated names stored in the cloud.
 */
export interface GeneratedName {
   name: string;
   generationAlgorithm: Generators;
   version: string;
}
