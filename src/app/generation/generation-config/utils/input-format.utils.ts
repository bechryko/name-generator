import { LetterUtils } from "@ngen-generation/generator-algorithms/letter-finalization/utils";

export class InputFormatUtils {
   public static formatInput(input: string): string {
      return this.sortCharacters(
         this.deleteDuplicateCharacters(
            this.deleteIllegalCharacters(input.toLowerCase())
         )
      );
   }

   public static deleteIllegalCharacters(input: string): string {
      let output = "";
      for(let i = 0; i < input.length; i++) {
         if(LetterUtils.is('letter', input[i])) {
            output += input[i];
         }
      }
      return output;
   }

   public static deleteDuplicateCharacters(input: string): string {
      let output = "";
      for(let i = 0; i < input.length; i++) {
         if(!output.includes(input[i])) {
            output += input[i];
         }
      }
      return output;
   }

   public static sortCharacters(input: string): string {
      return input.split("").sort().join("");
   }
}
