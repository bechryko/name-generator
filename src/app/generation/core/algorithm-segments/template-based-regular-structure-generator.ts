import { RegularUtils } from "@ngen-generation/generator-algorithms/letter-finalization/utils";
import { RegularString } from "@ngen-shared/models";
import { RandomUtils } from "@ngen-shared/utils";
import { AlgorithmDataType, AlgorithmSegment, GenerationData } from "../models";

export interface TemplateBasedRegularStructureGeneratorConfig {
   minLength: number;
   maxLength: number;
   regularNameStart: RegularString;
   regularNameEnd: RegularString;
   regularNameBase: RegularString;
}

export class TemplateBasedRegularStructureGenerator extends AlgorithmSegment<
   AlgorithmDataType.VOID,
   AlgorithmDataType.REGULAR_STRING_WITH_WILDCARDS,
   TemplateBasedRegularStructureGeneratorConfig
> {
   public override transform(
      _: undefined,
      config: TemplateBasedRegularStructureGeneratorConfig,
      data: GenerationData
   ): [RegularString, GenerationData] {
      const template = this.getRegularTemplate(config);
      const newData: GenerationData = {
         ...data,
         generationSteps: data.generationSteps + 1,
         regularTemplate: template.toString()
      };
      return [template, newData];
   }

   public override getInputType(): AlgorithmDataType.VOID {
      return AlgorithmDataType.VOID;
   }

   public override getOutputType(): AlgorithmDataType.REGULAR_STRING_WITH_WILDCARDS {
      return AlgorithmDataType.REGULAR_STRING_WITH_WILDCARDS;
   }

   private getRegularTemplate(config: TemplateBasedRegularStructureGeneratorConfig): RegularString {
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
}
