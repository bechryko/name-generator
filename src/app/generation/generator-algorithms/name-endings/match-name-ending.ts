import { GenerationConfig } from "@ngen-generation/models";
import { RegularString } from "@ngen-shared/models";
import { RandomUtils } from "@ngen-shared/utils";
import { LetterUtils } from "../letter-finalization/utils";
import { nameEndings } from "./name-endings";

export function matchNameEnding(regular: RegularString, config: GenerationConfig): RegularString {
   const matchingEndings = getFilteredNameEndings(config).filter(ending =>
      regular.ending(ending.length, true).doesMatch(ending)
   );
   const newRegular = regular.clone();
   if (matchingEndings.length) {
      const chosenEnding = RandomUtils.randomIndex(matchingEndings);
      newRegular.match(chosenEnding, newRegular.length - chosenEnding.length);
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
