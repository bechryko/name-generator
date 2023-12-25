import { GenerationConfig } from "@ngen-generation/models";
import { basicDefaultConfig } from "./basic-default-config";

export const regularDefaultConfig: GenerationConfig = {
   ...basicDefaultConfig,
   minLength: 4,
   maxLength: 10
};
