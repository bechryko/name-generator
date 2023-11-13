const fields = [
   "minLength",
   "maxLength"
] as const;

export type GeneratorConfigFields = Partial<Record<typeof fields[number], boolean>>;
