import { RandomUtils } from "@ngen-core/utils";
import { GenerationConfig, RegularNameObject } from "@ngen-generation/models";
import { LetterUtils, RegularUtils } from "../letter-finalization/utils";
import { nameEndings } from "./name-endings";

export function matchNameEnding<T extends string | RegularNameObject>(regular: T, config: GenerationConfig): T {
   if (typeof regular === "string") {
      return matchStringNameEnding(regular, config) as T;
   }
   return matchRegularNameObjectNameEnding(regular, config) as T;
}

function matchStringNameEnding(regular: string, config: GenerationConfig): string {
   const matchingEndings: string[] = [];
   for (const ending of getFilteredNameEndings(config)) {
      const matchingEnding = RegularUtils.matchRegular(ending, regular.substring(regular.length - ending.length));
      if (matchingEnding) {
         matchingEndings.push(matchingEnding);
      }
   }
   if (matchingEndings.length) {
      const chosenEnding = RandomUtils.randomIndex(matchingEndings);
      regular = regular.substring(0, regular.length - chosenEnding.length) + chosenEnding;
   }
   return regular;
}

function matchRegularNameObjectNameEnding(regular: RegularNameObject, config: GenerationConfig): RegularNameObject {
   const matchingEndings: string[] = [];
   for (const ending of getFilteredNameEndings(config)) {
      const matchingEnding = RegularUtils.matchRegular(
         ending,
         regular.referenceRegular.substring(regular.referenceRegular.length - ending.length)
      );
      if (matchingEnding) {
         matchingEndings.push(matchingEnding);
      }
   }
   const newRegular = regular.copy();
   if (matchingEndings.length) {
      const chosenEnding = RandomUtils.randomIndex(matchingEndings);
      newRegular.overrideEnding(chosenEnding);
   }
   return newRegular;
}

function getFilteredNameEndings(config: GenerationConfig): string[] {
   let endings = nameEndings;
   if (!config.excludedLetters.isEmpty()) {
      endings = endings.filter(ending => !config.excludedLetters.includesLetterFrom(ending));
   }
   if (!config.includedLetters.isEmpty()) {
      endings = endings.filter(ending =>
         ending
            .split("")
            .every(endingLetter => !LetterUtils.is("letter", endingLetter) || config.includedLetters.has(endingLetter))
      );
   }
   return endings;
}
