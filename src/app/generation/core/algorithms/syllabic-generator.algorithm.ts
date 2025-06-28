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
      if (LetterUtils.is("vowel", name[i + 1]) && !LetterUtils.is("vowel", name[i])) {
         syllables.push("");
      }
      syllables[syllables.length - 1] += name[i];
   }
   return syllables.filter(syllable => syllable.length > 0);
}
