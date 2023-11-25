import { Generators } from "@ngen-generation/enums";
import { GenerationConfig } from "@ngen-generation/models";
import { createFeature, createReducer, on } from "@ngrx/store";
import { configurationActions } from "./configuration.actions";
import { ConfigurationState } from "./configuration.state";

const basicGenerationConfig: GenerationConfig = {
   minLength: 1,
   maxLength: 100,
   excludedLetters: "",
   includedLetters: "",
   ignoreVoicedUnvoicedPairs: false,
   regularNameStart: "",
   regularNameEnd: "",
   regularNameBase: ""
};

const initialState: ConfigurationState = {
   [Generators.JAPANESE]: {
      ...basicGenerationConfig,
      minLength: 2,
      maxLength: 4
   },
   [Generators.SYLLABIC]: {
      ...basicGenerationConfig,
      minLength: 1,
      maxLength: 5
   },
   [Generators.REGULAR]: {
      ...basicGenerationConfig,
      minLength: 4,
      maxLength: 10
   },
};

export const configurationFeature = createFeature({
   name: 'configuration',
   reducer: createReducer(
      initialState,
      on(configurationActions.save, (state, { generator, config }) => ({
         ...state,
         [generator]: config
      }))
   )
});
