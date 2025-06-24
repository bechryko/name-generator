import { Injectable } from "@angular/core";
import { GenerationConfig } from "@ngen-generation/models";
import { capitalize } from "@ngen-shared/functions";
import { JapaneseName } from "@ngen-shared/names";
import { RandomUtils } from "@ngen-shared/utils";
import { GeneratorService } from "../generator-service.model";
import { JapaneseLetter } from "./japanese-letter";
import { japaneseLetterList } from "./japanese-letter-list";

@Injectable()
export class JapaneseGeneratorService implements GeneratorService {
   public generateName(config: GenerationConfig): JapaneseName {
      let length = RandomUtils.between(config.minLength, config.maxLength);
      let name: JapaneseName = { romaji: "", hiragana: "", katakana: "" };
      for (let i = 0; i < length; i++) {
         name = this.appendToName(name, RandomUtils.randomIndex(japaneseLetterList));
      }
      name.romaji = capitalize(name.romaji);
      return name;
   }

   private appendToName(name: JapaneseName, letter: JapaneseLetter): JapaneseName {
      for (const key in letter) {
         const form = key as keyof JapaneseLetter;
         name[form] += letter[form];
      }
      return name;
   }
}
