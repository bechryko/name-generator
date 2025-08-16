import { GenerationConfig } from "./generation-config";

export type AvailableLetters = Pick<GenerationConfig, "includedLetters" | "excludedLetters">;
