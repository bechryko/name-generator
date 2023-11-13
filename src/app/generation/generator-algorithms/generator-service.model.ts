import { Name } from "@core/names";
import { GenerationConfig } from "@generation/models";

export interface GeneratorService {
   generateName: (config: GenerationConfig) => Name;
   completeConfig: (config: GenerationConfig) => GenerationConfig;
}
