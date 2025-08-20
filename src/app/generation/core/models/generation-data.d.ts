import { GenerationErrors } from "./generation-errors";

export interface GenerationData {
   generationSteps: number;
   errors: GenerationErrors;
   regularTemplate?: string;
   syllabized?: string;
   hiragana?: string;
   katakana?: string;
}
