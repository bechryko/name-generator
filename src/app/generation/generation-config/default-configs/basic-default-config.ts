import { LetterSet, RegularString } from "@ngen-core/models";
import { GenerationConfig } from "@ngen-generation/models";

export const basicDefaultConfig: GenerationConfig = {
   minLength: 1,
   maxLength: 100,
   excludedLetters: new LetterSet(),
   includedLetters: new LetterSet(),
   ignoreVoicedUnvoicedPairs: false,
   regularNameStart: new RegularString(),
   regularNameEnd: new RegularString(),
   regularNameBase: new RegularString()
};
