import { Generators } from "../enums";
import { GeneratorFlagKey } from "../models";

/**
 * Marks for special generators.
 */
export const generatorFlags: Record<GeneratorFlagKey, Generators> = {
   best: Generators.SYLLABIC
};
