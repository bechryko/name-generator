import { LetterSet } from "@ngen-core/models/letter-set";
import { GenerationConfig } from "@ngen-generation/models";

export const basicDefaultConfig: GenerationConfig = {
   minLength: 1,
   maxLength: 100,
   excludedLetters: new LetterSet(),
   includedLetters: new LetterSet(),
   ignoreVoicedUnvoicedPairs: false,
   regularNameStart: "",
   regularNameEnd: "",
   regularNameBase: ""
};
