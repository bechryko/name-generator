import { GenerationConfig } from "@ngen-generation/core/models";
import { basicDefaultConfig } from "./basic-default-config";

export const phoneticDefaultConfig: GenerationConfig = {
   ...basicDefaultConfig,
   minLength: 2,
   maxLength: 4
};
