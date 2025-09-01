import { GeneratorAlgorithmName } from "@ngen-generation/core/enums";
import { GenerationConfig } from "@ngen-generation/core/models";

export interface BulkGenerationDialogData {
   algorithmName: GeneratorAlgorithmName;
   config: GenerationConfig;
}
