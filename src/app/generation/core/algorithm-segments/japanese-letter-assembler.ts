import { RandomUtils } from "@ngen-shared/utils";
import { japaneseLetterList } from "../constants";
import { AlgorithmDataType } from "../enums";
import { AlgorithmSegment, GenerationData, JapaneseLetter } from "../models";

export interface JapaneseLetterAssemblerConfig {
   minLength: number;
   maxLength: number;
   disableLetterWeights: boolean;
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

      const letterWeights = japaneseLetterList.map(letter => this.getLetterWeight(letter, config));
      for (let i = 0; i < length; i++) {
         const letter = RandomUtils.randomIndexWeighted(japaneseLetterList, letterWeights);
         name.romaji += letter.romaji;
         name.hiragana += letter.hiragana;
         name.katakana += letter.katakana;
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

   private getLetterWeight(letter: JapaneseLetter, config: JapaneseLetterAssemblerConfig): number {
      if (config.disableLetterWeights) {
         return 1;
      }
      return letter.weight ?? 1;
   }
}
