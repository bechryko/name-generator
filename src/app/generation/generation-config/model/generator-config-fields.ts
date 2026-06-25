import { GenerationConfig } from "@ngen-generation/core/models";

const fields = [
   "seed",
   "minLength",
   "maxLength",
   "excludedLetters",
   "includedLetters",
   "ignoreVoicedUnvoicedPairs",
   "regularNameStart",
   "regularNameEnd",
   "regularNameBase",
   "syllableAlleviation",
   "disableLetterWeights"
] as const satisfies (keyof GenerationConfig)[];

/**
 * Describes whether the fields are needed for the given generator.
 */
export type GeneratorConfigFields = Partial<Record<(typeof fields)[number], boolean>>;
