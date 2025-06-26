import { AlgorithmDataType, AlgorithmPart, GenerationData } from "../models";

export interface CapitalizerConfig {}

export class Capitalizer extends AlgorithmPart<AlgorithmDataType.NAME, AlgorithmDataType.NAME, CapitalizerConfig> {
   public override transform(input: string, _: CapitalizerConfig, data: GenerationData): [string, GenerationData] {
      return [
         this.capitalize(input),
         {
            ...data,
            generationSteps: data.generationSteps + 1
         }
      ];
   }

   public override getInputType(): AlgorithmDataType.NAME {
      return AlgorithmDataType.NAME;
   }

   public override getOutputType(): AlgorithmDataType.NAME {
      return AlgorithmDataType.NAME;
   }

   private capitalize(name: string): string {
      if (name.length === 0) {
         return "";
      }
      return name[0].toUpperCase() + name.substring(1);
   }
}
