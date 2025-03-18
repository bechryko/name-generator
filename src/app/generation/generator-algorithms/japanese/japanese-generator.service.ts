import { Injectable } from '@angular/core';
import { capitalize } from '@ngen-core/functions';
import { JapaneseName } from '@ngen-core/names';
import { RandomUtils } from '@ngen-core/utils';
import { GenerationConfig } from '@ngen-generation/models';
import { GeneratorAlgorithmsModule } from '../generator-algorithms.module';
import { GeneratorService } from '../generator-service.model';
import { JAPANESE_GENERATOR_VERSION } from './japanese-generator-version';
import { JapaneseLetter } from './japanese-letter';
import { japaneseLetterList } from './japanese-letter-list';

@Injectable({
   providedIn: GeneratorAlgorithmsModule
})
export class JapaneseGeneratorService implements GeneratorService {
   public readonly version = JAPANESE_GENERATOR_VERSION;

   public generateName(config: GenerationConfig): JapaneseName {
      console.log(config)
      let length = RandomUtils.between(config.minLength, config.maxLength);
      let name: JapaneseName = { romaji: "", hiragana: "", katakana: "" };
      for (let i = 0; i < length; i++) {
         name = this.appendToName(name, RandomUtils.randomIndex(japaneseLetterList));
      }
      name.romaji = capitalize(name.romaji);
      return name;
   }

   private appendToName(name: JapaneseName, letter: JapaneseLetter): JapaneseName {
      for(const key in letter) {
         const form = key as keyof JapaneseLetter;
         name[form] += letter[form];
      }
      return name;
   }
}
