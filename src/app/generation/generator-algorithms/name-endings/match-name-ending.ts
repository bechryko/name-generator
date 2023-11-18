import { RandomUtils } from "@ngen-core/utils";
import { RegularUtils } from "../letter-finalization/utils";
import { nameEndings } from "./name-endings";

export function matchNameEnding(regular: string): string {
   const matchingEndings: string[] = [];
   for(const ending of nameEndings) {
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
