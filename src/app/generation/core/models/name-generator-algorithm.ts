import { AlgorithmDataType } from "../enums/algorithm-data-type";
import { AlgorithmSegment } from "./algorithm-segment";
import { GenerationConfig } from "./generation-config";
import { GenerationData } from "./generation-data";
import { GenerationErrors } from "./generation-errors";

export class NameGeneratorAlgorithm {
   constructor(
      public readonly name: string,
      private readonly segments: AlgorithmSegment<any, any, any>[],
      private readonly postGenerationDataModifier?: (name: string, data: GenerationData) => GenerationData
   ) {
      this.checkSegmentPipeline();
   }

   public generateName(config: GenerationConfig): [string, GenerationData] {
      let currentNameState: any = undefined;
      let generationData: GenerationData = {
         generationSteps: 0,
         errors: new GenerationErrors()
      };

      this.segments.forEach(segment => {
         [currentNameState, generationData] = segment.transform(currentNameState, config, generationData);
      });

      if (this.postGenerationDataModifier) {
         generationData = this.postGenerationDataModifier(currentNameState, generationData);
      }

      return [currentNameState, generationData];
   }

   private checkSegmentPipeline(): void {
      if (!this.segments.length) {
         this.throwGeneratorInitError("The generation pipeline of an algorithm cannot be empty!");
      }

      this.segments.forEach((currentSegment, index) => {
         if (index === 0) {
            if (currentSegment.getInputType() !== AlgorithmDataType.VOID) {
               this.throwGeneratorInitError(
                  `The first segment of an algorithm should have a void input type! (Current: ${currentSegment.getInputType()})`
               );
            }
         }

         const previousSegment = this.segments[index - 1];
         if (previousSegment && currentSegment.getInputType() !== previousSegment.getOutputType()) {
            this.throwGeneratorInitError(
               `Mismatch of types for consecutive segments: ${previousSegment.getOutputType()} (output) and ${currentSegment.getInputType()} (input)`
            );
         }

         if (index === this.segments.length - 1) {
            if (currentSegment.getOutputType() !== AlgorithmDataType.NAME) {
               this.throwGeneratorInitError(
                  `The last segment of an algorithm should have a name input type! (Current: ${currentSegment.getOutputType()})`
               );
            }
         }
      });
   }

   private throwGeneratorInitError(message: string): never {
      throw new Error(`[Generator initialization error] ${this.name}: ${message}`);
   }
}
