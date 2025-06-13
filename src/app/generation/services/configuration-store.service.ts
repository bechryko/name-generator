import { Injectable } from "@angular/core";
import { Generators } from "@ngen-generation/enums";
import {
   japaneseDefaultConfig,
   regularDefaultConfig,
   syllabicDefaultConfig
} from "@ngen-generation/generation-config/default-configs";
import { GenerationConfig } from "@ngen-generation/models";

@Injectable()
export class ConfigurationStoreService {
   private readonly storedConfigs: Record<Generators, GenerationConfig> = {
      [Generators.JAPANESE]: japaneseDefaultConfig,
      [Generators.SYLLABIC]: syllabicDefaultConfig,
      [Generators.REGULAR]: regularDefaultConfig
   };

   public saveConfig(generator: Generators, config: GenerationConfig): void {
      this.storedConfigs[generator] = config;
   }

   public loadConfig(generator: Generators): GenerationConfig {
      return this.storedConfigs[generator];
   }
}
