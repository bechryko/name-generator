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

export type GeneratorConfigFields = Partial<Record<typeof fields[number], boolean>>;
