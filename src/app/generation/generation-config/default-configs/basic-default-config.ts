import { GenerationConfig } from "@ngen-generation/core/models";
import { LetterSet, RegularString } from "@ngen-shared/models";

export const basicDefaultConfig: GenerationConfig = {
   minLength: 1,
   maxLength: 100,
   excludedLetters: new LetterSet(),
   includedLetters: new LetterSet(),
   ignoreVoicedUnvoicedPairs: false,
   regularNameStart: new RegularString(),
   regularNameEnd: new RegularString(),
   regularNameBase: new RegularString(),
   syllableAlleviation: true,
   disableLetterWeights: false
};
