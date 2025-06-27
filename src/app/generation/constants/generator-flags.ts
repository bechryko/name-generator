import { GeneratorAlgorithmName } from "../enums";
import { GeneratorFlagKey } from "../models";

/**
 * Marks for special generators.
 */
export const generatorFlags: Record<GeneratorFlagKey, GeneratorAlgorithmName> = {
   best: GeneratorAlgorithmName.SYLLABIC
};
