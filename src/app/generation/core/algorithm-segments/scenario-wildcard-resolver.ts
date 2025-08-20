import { RegularCharacter, RegularString } from "@ngen-shared/models";
import { RandomUtils } from "@ngen-shared/utils";
import { scenarioDescriptions } from "../constants";
import { AlgorithmDataType } from "../enums";
import { AlgorithmSegment, GenerationConfig, GenerationData, ScenarioDescription } from "../models";
import { LetterUtils, RegularUtils } from "../utils";

export type ScenarioWildcardResolverConfig = Pick<
   GenerationConfig,
   "excludedLetters" | "includedLetters" | "disableLetterWeights"
>;

export class ScenarioWildcardResolver extends AlgorithmSegment<
   AlgorithmDataType.REGULAR_STRING_WITH_WILDCARDS,
   AlgorithmDataType.REGULAR_STRING,
   ScenarioWildcardResolverConfig
> {
   private readonly scenarioCharacters = {
      toResolve: "?",
      vowel: RegularUtils.symbols.vowel,
      consonant: RegularUtils.symbols.consonant,
      wildcard: RegularUtils.symbols.wildcard,
      any: "."
   } as const;

   public override transform(
      input: RegularString,
      config: ScenarioWildcardResolverConfig,
      data: GenerationData
   ): [RegularString, GenerationData] {
      const regular = input.clone();
      const characters = regular.getCharacters();

      characters.forEach((char, index) => {
         if (char.isWildcard) {
            const scenario =
               scenarioDescriptions.find(scenario => this.isScenarioMatching(scenario, characters, index)) ??
               ({ resolution: "random" } as ScenarioDescription);
            char.assign(this.getScenarioResolution(scenario, config));
         }
      });

      const newData: GenerationData = {
         ...data,
         generationSteps: data.generationSteps + 1,
         regularTemplate: regular.toString()
      };
      return [regular, newData];
   }

   public override getInputType(): AlgorithmDataType.REGULAR_STRING_WITH_WILDCARDS {
      return AlgorithmDataType.REGULAR_STRING_WITH_WILDCARDS;
   }

   public override getOutputType(): AlgorithmDataType.REGULAR_STRING {
      return AlgorithmDataType.REGULAR_STRING;
   }

   private isScenarioMatching(
      description: ScenarioDescription,
      characters: RegularCharacter[],
      index: number
   ): boolean {
      const indexInScenario = description.scenario.indexOf(this.scenarioCharacters.toResolve);

      for (let idx = 0; idx < description.scenario.length; idx++) {
         if (idx === indexInScenario) {
            continue;
         }

         const idxInCharacters = index - indexInScenario + idx;
         if (idxInCharacters < 0 || idxInCharacters >= characters.length) {
            return false;
         }

         if (!this.isScenarioCharacterMatching(description.scenario[idx], characters[idxInCharacters])) {
            return false;
         }
      }

      return true;
   }

   private isScenarioCharacterMatching(scenarioCharacter: string, character: RegularCharacter): boolean {
      switch (scenarioCharacter) {
         case this.scenarioCharacters.vowel:
            return character.isVowel;
         case this.scenarioCharacters.consonant:
            return character.isConsonant;
         case this.scenarioCharacters.wildcard:
            return character.isWildcard;
         case this.scenarioCharacters.any:
            return true;
      }

      throw new Error(`Invalid character in scenario: '${scenarioCharacter}'`);
   }

   private getScenarioResolution(scenario: ScenarioDescription, config: ScenarioWildcardResolverConfig): string {
      if (scenario.resolution === "random") {
         return RandomUtils.byChance(LetterUtils.getVowelChance(config))
            ? RegularUtils.symbols.vowel
            : RegularUtils.symbols.consonant;
      }

      return RegularUtils.symbols[scenario.resolution];
   }
}
