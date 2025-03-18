const fields = [
   "minLength",
   "maxLength",
   "excludedLetters",
   "includedLetters",
   "ignoreVoicedUnvoicedPairs",
   "regularNameStart",
   "regularNameEnd",
   "regularNameBase"
] as const;

/**
 * Describes whether the fields are needed for the given generator.
 */
export type GeneratorConfigFields = Partial<Record<typeof fields[number], boolean>>;
