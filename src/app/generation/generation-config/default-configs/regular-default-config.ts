import { GenerationConfig } from "@ngen-generation/core/models";
import { basicDefaultConfig } from "./basic-default-config";

export const regularDefaultConfig: GenerationConfig = {
   ...basicDefaultConfig,
   minLength: 4,
   maxLength: 10
};
