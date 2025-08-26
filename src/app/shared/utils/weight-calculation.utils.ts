import { RegularUtils } from "@ngen-generation/core/utils";
import { getCharacterContainer } from "@ngen-shared/functions";
import { Weighted } from "@ngen-shared/models";

export class WeightCalculationUtils {
   public static assignWeights<T>(array: T[], weightAssignFn: (element: T, index: number) => number): Weighted<T>[] {
      return array.map((value, index) => ({
         value,
         weight: weightAssignFn(value, index)
      }));
   }

   public static addWeightByWeightLookup(array: string[], lookup: Record<string, number>): Weighted<string>[] {
      return array.map(value => ({
         value,
         weight: lookup[value]
      }));
   }

   public static getWeightLookupForRegularTemplates(templates: string[]): Record<string, number> {
      return templates.reduce<Record<string, number>>((lookup, template) => {
         let weight = 1;

         for (let i = 0; i < template.length; i++) {
            if (template[i] === RegularUtils.symbols.setStart) {
               const letterOptions = getCharacterContainer(template, i, RegularUtils.symbols.setEnd).length;
               weight *= letterOptions;
               i += letterOptions + 1;
            }
         }

         return {
            ...lookup,
            [template]: weight
         };
      }, {});
   }
}
