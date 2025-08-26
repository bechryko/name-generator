import { RandomUtils, WeightCalculationUtils } from "@ngen-shared/utils";
import { japaneseLetterList } from "../constants";
import { AlgorithmDataType } from "../enums";
import { AlgorithmSegment, GenerationConfig, GenerationData, JapaneseLetter } from "../models";

export type JapaneseLetterAssemblerConfig = Pick<GenerationConfig, "minLength" | "maxLength" | "disableLetterWeights">;

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
      const weightedLetters = WeightCalculationUtils.assignWeights(japaneseLetterList, letter =>
         this.getLetterWeight(letter, config)
      );

      for (let i = 0; i < length; i++) {
         const letter = RandomUtils.randomIndexWeighted2(weightedLetters);
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
