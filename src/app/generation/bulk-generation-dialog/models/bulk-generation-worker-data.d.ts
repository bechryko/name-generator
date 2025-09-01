import { GeneratorAlgorithmName } from "@ngen-generation/core/enums";

export interface BulkGenerationWorkerData {
   algorithmName: GeneratorAlgorithmName;
   generationTimes: number;
   configJSON: string;
}
