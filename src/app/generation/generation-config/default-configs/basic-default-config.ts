import { GenerationConfig } from "@ngen-generation/models";

export const basicDefaultConfig: GenerationConfig = {
   minLength: 1,
   maxLength: 100,
   excludedLetters: "",
   includedLetters: "",
   ignoreVoicedUnvoicedPairs: false,
   regularNameStart: "",
   regularNameEnd: "",
   regularNameBase: ""
};
