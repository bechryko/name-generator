import { Name } from "@ngen-core/names";
import { GenerationConfig } from "@ngen-generation/models";

export interface GeneratorService {
   readonly version: string;
   generateName(config: GenerationConfig): Name;
}
