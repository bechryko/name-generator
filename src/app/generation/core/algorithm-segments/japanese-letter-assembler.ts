import { RandomUtils } from "@ngen-shared/utils";
import { japaneseLetterList } from "../constants";
import { AlgorithmDataType } from "../enums";
import { AlgorithmSegment, GenerationData, JapaneseLetter } from "../models";

export interface JapaneseLetterAssemblerConfig {
   minLength: number;
   maxLength: number;
}

export class JapaneseLetterAssembler extends AlgorithmSegment<
   AlgorithmDataType.VOID,
   AlgorithmDataType.NAME,
   JapaneseLetterAssemblerConfig
> {
   public override transform(
      _: undefined,
      config: JapaneseLetterAssemblerConfig,
      data: GenerationData
   ): [string, GenerationData] {
      const length = RandomUtils.between(config.minLength, config.maxLength);
      const name = {
         romaji: "",
         hiragana: "",
         katakana: ""
      };

      for (let i = 0; i < length; i++) {
         const letter = RandomUtils.randomIndex(japaneseLetterList);

         for (const key in letter) {
            name[key as keyof JapaneseLetter] += letter[key as keyof JapaneseLetter];
         }
      }

      const newData: GenerationData = {
         ...data,
         generationSteps: data.generationSteps + 1,
         hiragana: name.hiragana,
         katakana: name.katakana
      };
      return [name.romaji, newData];
   }

   public override getInputType(): AlgorithmDataType.VOID {
      return AlgorithmDataType.VOID;
   }

   public override getOutputType(): AlgorithmDataType.NAME {
      return AlgorithmDataType.NAME;
   }
}
