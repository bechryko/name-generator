import {
   BasicLetterFinalizer,
   NameEndingApplier,
   ProximityWildcardResolver,
   TemplateBasedRegularStructureGenerator
} from "../algorithm-parts";
import { NameGeneratorAlgorithm } from "../models";

export const regularGeneratorAlgorithm = new NameGeneratorAlgorithm("Regular", [
   new TemplateBasedRegularStructureGenerator(),
   new ProximityWildcardResolver(),
   new NameEndingApplier(),
   new BasicLetterFinalizer()
]);
