import { Capitalizer, PhoneticWordGenerator } from "../algorithm-segments";
import { GeneratorAlgorithmName } from "../enums";
import { NameGeneratorAlgorithm } from "../models";

export const phoneticGeneratorAlgorithm = new NameGeneratorAlgorithm(GeneratorAlgorithmName.PHONETIC, [
   new PhoneticWordGenerator(),
   new Capitalizer()
]);
