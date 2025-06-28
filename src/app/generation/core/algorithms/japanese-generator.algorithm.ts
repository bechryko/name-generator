import { GeneratorAlgorithmName } from "@ngen-generation/core/enums";
import { Capitalizer, JapaneseLetterAssembler } from "../algorithm-segments";
import { NameGeneratorAlgorithm } from "../models";

export const japaneseGeneratorAlgorithm = new NameGeneratorAlgorithm(GeneratorAlgorithmName.JAPANESE, [
   new JapaneseLetterAssembler(),
   new Capitalizer()
]);
