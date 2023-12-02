import { RandomUtils } from "@ngen-core/utils";
import { GenerationConfig } from "@ngen-generation/models";
import { LetterUtils, RegularUtils } from "../letter-finalization/utils";
import { nameEndings } from "./name-endings";

export function matchNameEnding(regular: string, config: GenerationConfig): string {
   const matchingEndings: string[] = [];
   for(const ending of getFilteredNameEndings(config)) {
      if(RegularUtils.matchRegular(ending, regular.substring(regular.length - ending.length))) {
         matchingEndings.push(ending);
      }
   }
   if(matchingEndings.length) {
      const chosenEnding = RandomUtils.randomIndex(matchingEndings);
      regular = regular.substring(0, regular.length - chosenEnding.length) + chosenEnding;
   }
   return regular;
}

function getFilteredNameEndings(config: GenerationConfig): string[] {
   let endings = nameEndings;
   if(config.excludedLetters.length) {
      endings = endings.filter(ending => config.excludedLetters.split("").every(letter => !ending.includes(letter)));
   }
   if(config.includedLetters.length) {
      endings = endings.filter(ending => ending.split("").every(endingLetter => !LetterUtils.is('letter', endingLetter) || config.includedLetters.includes(endingLetter)));
   }
   return endings;
}
