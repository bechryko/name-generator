import { GenerationConfig } from "@ngen-generation/models";
import { basicDefaultConfig } from "./basic-default-config";

export const syllabicDefaultConfig: GenerationConfig = {
   ...basicDefaultConfig,
   minLength: 1,
   maxLength: 5
};
