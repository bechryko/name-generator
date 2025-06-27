import { Injectable } from "@angular/core";
import { GeneratorAlgorithmName } from "@ngen-generation/enums";
import {
   japaneseDefaultConfig,
   regularDefaultConfig,
   syllabicDefaultConfig
} from "@ngen-generation/generation-config/default-configs";
import { GenerationConfig } from "@ngen-generation/models";

@Injectable({
   providedIn: "root"
})
export class ConfigurationStoreService {
   private readonly storedConfigs: Record<GeneratorAlgorithmName, GenerationConfig> = {
      [GeneratorAlgorithmName.JAPANESE]: japaneseDefaultConfig,
      [GeneratorAlgorithmName.SYLLABIC]: syllabicDefaultConfig,
      [GeneratorAlgorithmName.REGULAR]: regularDefaultConfig
   };

   public saveConfig(generator: GeneratorAlgorithmName, config: GenerationConfig): void {
      this.storedConfigs[generator] = config;
   }

   public loadConfig(generator: GeneratorAlgorithmName): GenerationConfig {
      return this.storedConfigs[generator];
   }
}
