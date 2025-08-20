import { GeneratorAlgorithmName } from "@ngen-generation/core/enums";
import {
   BasicLetterFinalizer,
   Capitalizer,
   NameEndingApplier,
   ScenarioWildcardResolver,
   TemplateBasedRegularStructureGenerator
} from "../algorithm-segments";
import { NameGeneratorAlgorithm } from "../models";

export const regularGeneratorAlgorithm = new NameGeneratorAlgorithm(GeneratorAlgorithmName.REGULAR, [
   new TemplateBasedRegularStructureGenerator(),
   new ScenarioWildcardResolver(),
   new NameEndingApplier(),
   new BasicLetterFinalizer(),
   new Capitalizer()
]);
