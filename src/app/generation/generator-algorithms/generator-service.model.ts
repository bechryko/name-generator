import { Name } from "@ngen-core/names";
import { GenerationConfig } from "@ngen-generation/models";

export interface GeneratorService {
   generateName(config: GenerationConfig): Name;
}
