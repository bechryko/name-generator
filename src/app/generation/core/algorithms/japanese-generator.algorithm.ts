import { Capitalizer, JapaneseLetterAssembler } from "../algorithm-segments";
import { NameGeneratorAlgorithm } from "../models";

export const japaneseGeneratorAlgorithm = new NameGeneratorAlgorithm("Japanese", [
   new JapaneseLetterAssembler(),
   new Capitalizer()
]);
