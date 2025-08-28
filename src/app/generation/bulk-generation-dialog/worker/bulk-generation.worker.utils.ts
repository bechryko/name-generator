import { GenerationUtils } from "@ngen-generation/utils";
import { BulkGenerationWorkerData, GeneratedName } from "../models";

export class BulkGenerationWorkerUtils {
   public static generate(data: BulkGenerationWorkerData): GeneratedName[] {
      const names: GeneratedName[] = [];
      const algorithm = GenerationUtils.findAlgorithm(data.algorithmName);
      const config = GenerationUtils.JSONToConfig(data.configJSON);

      for (let i = 0; i < data.generationTimes; i++) {
         names.push(algorithm.generateName(config));
      }

      return names;
   }
}
