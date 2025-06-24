import { RegularUtils } from "@ngen-generation/generator-algorithms/letter-finalization/utils";
import { RegularString } from "@ngen-shared/models";
import { RandomUtils } from "@ngen-shared/utils";
import { AlgorithmDataType, AlgorithmPart } from "../models";

export interface TemplateBasedRegularStructureGeneratorConfig {
   minLength: number;
   maxLength: number;
   regularNameStart: RegularString;
   regularNameEnd: RegularString;
   regularNameBase: RegularString;
}

export class TemplateBasedRegularStructureGenerator extends AlgorithmPart<
   AlgorithmDataType.VOID,
   AlgorithmDataType.REGULAR_STRING_WITH_WILDCARDS,
   TemplateBasedRegularStructureGeneratorConfig
> {
   public override transform(_: undefined, config: TemplateBasedRegularStructureGeneratorConfig): RegularString {
      if (config.regularNameBase.length) {
         return config.regularNameBase.clone();
      }

      const length = RandomUtils.between(config.minLength, config.maxLength);
      const regularBase = config.regularNameStart.clone();
      for (let i = config.regularNameStart.length; i < length - config.regularNameEnd.length; i++) {
         regularBase.append(RegularUtils.symbols.wildcard);
      }
      regularBase.append(config.regularNameEnd);
      return regularBase;
   }

   public override getInputType(): AlgorithmDataType.VOID {
      return AlgorithmDataType.VOID;
   }

   public override getOutputType(): AlgorithmDataType.REGULAR_STRING_WITH_WILDCARDS {
      return AlgorithmDataType.REGULAR_STRING_WITH_WILDCARDS;
   }
}
