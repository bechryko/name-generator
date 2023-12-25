import { Generators } from "@ngen-generation/enums";
import { createFeature, createReducer, on } from "@ngrx/store";
import { japaneseDefaultConfig, regularDefaultConfig, syllabicDefaultConfig } from "../default-configs";
import { configurationActions } from "./configuration.actions";
import { ConfigurationState } from "./configuration.state";

const initialState: ConfigurationState = {
   [Generators.JAPANESE]: japaneseDefaultConfig,
   [Generators.SYLLABIC]: syllabicDefaultConfig,
   [Generators.REGULAR]: regularDefaultConfig,
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
