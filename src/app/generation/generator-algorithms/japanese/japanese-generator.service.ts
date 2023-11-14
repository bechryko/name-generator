import { Injectable } from '@angular/core';
import { JapaneseName } from '@ngen-core/names';
import { NameFormatUtils, RandomUtils } from '@ngen-core/utils';
import { GenerationConfig } from '@ngen-generation/models';
import { GeneratorAlgorithmsModule } from '../generator-algorithms.module';
import { GeneratorService } from '../generator-service.model';
import { JapaneseLetter } from './japanese-letter';
import { japaneseLetterList } from './japanese-letter-list';

@Injectable({
  providedIn: GeneratorAlgorithmsModule
})
export class JapaneseGeneratorService implements GeneratorService {
  public generateName(config: GenerationConfig): JapaneseName {
    let length = RandomUtils.between(config.minLength, config.maxLength);
    let name: JapaneseName = { romaji: "", hiragana: "", katakana: "" };
    for(let i = 0; i < length; i++) {
        name = this.appendToName(name, RandomUtils.randomIndex(japaneseLetterList));
    }
    name.romaji = NameFormatUtils.capitalizeName(name.romaji);
    return name;
  }

  private appendToName(name: JapaneseName, letter: JapaneseLetter): JapaneseName {
    name.romaji += letter.romaji;
    name.hiragana += letter.hiragana;
    name.katakana += letter.katakana;
    return name;
  }
}
