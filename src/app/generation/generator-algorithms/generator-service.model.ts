import { GenerationConfig } from "@ngen-generation/models";
import { Name } from "@ngen-shared/names";

export interface GeneratorService {
   generateName(config: GenerationConfig): Name;
}
