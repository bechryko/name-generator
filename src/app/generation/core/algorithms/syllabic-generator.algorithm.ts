import { GeneratorAlgorithmName } from "@ngen-generation/core/enums";
import {
   BasicLetterFinalizer,
   Capitalizer,
   NameEndingApplier,
   SyllabicRegularStructureGenerator
} from "../algorithm-segments";
import { GenerationData, NameGeneratorAlgorithm } from "../models";
import { LetterUtils } from "../utils";

export const syllabicGeneratorAlgorithm = new NameGeneratorAlgorithm(
   GeneratorAlgorithmName.SYLLABIC,
   [new SyllabicRegularStructureGenerator(), new NameEndingApplier(), new BasicLetterFinalizer(), new Capitalizer()],
   (name, data) => {
      const syllables = syllabize(name);
      const newData: GenerationData = {
         ...data,
         syllabized: syllables.join("-")
      };
      return newData;
   }
);

function syllabize(name: string): string[] {
   const syllables: string[] = [""];

   for (let i = 0; i < name.length; i++) {
      syllables[0] += name[i];

      if (isVowel(name[i])) {
         break;
      }
   }

   for (let i = syllables[0].length; i < name.length; i++) {
      if ((isVowel(name[i + 1]) && !isVowel(name[i])) || (isVowel(name[i - 1]) && isVowel(name[i]))) {
         syllables.push("");
      }
      syllables[syllables.length - 1] += name[i];
   }

   return syllables.filter(syllable => syllable.length > 0);
}

function isVowel(char?: string): boolean {
   if (!char) {
      return false;
   }
   return LetterUtils.is("vowel", char.toLowerCase());
}
