import { Generators } from "@ngen-generation/enums";
import { GenerationConfig } from "@ngen-generation/models";
import { MemoizedSelector } from "@ngrx/store";
import { configurationFeature } from "./configuration-feature";
import { ConfigurationState } from "./configuration-state";

export const configurationSelectors: Record<
   Generators,
   MemoizedSelector<Record<string, any>, GenerationConfig, (featureState: ConfigurationState) => GenerationConfig>
> = {
   [Generators.JAPANESE]: configurationFeature.selectJapanese,
   [Generators.SYLLABIC]: configurationFeature.selectSyllabic,
   [Generators.REGULAR]: configurationFeature.selectRegular
};
