import { GenerationConfig } from "@ngen-generation/models";
import { AlgorithmDataType } from "./algorithm-data-type";
import { AlgorithmPart } from "./algorithm-part";

export class NameGeneratorAlgorithm {
   constructor(
      public readonly name: string,
      private readonly segments: AlgorithmPart<any, any, any>[]
   ) {
      this.checkSegmentPipeline();
   }

   public generateName(config: GenerationConfig): string {
      let currentData: any = undefined;

      this.segments.forEach(segment => {
         currentData = segment.transform(currentData, config);
      });

      return currentData;
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
