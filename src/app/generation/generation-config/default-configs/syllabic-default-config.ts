import { GenerationConfig } from "@ngen-generation/core/models";
import { basicDefaultConfig } from "./basic-default-config";

export const syllabicDefaultConfig: GenerationConfig = {
   ...basicDefaultConfig,
   minLength: 2,
   maxLength: 4
};
