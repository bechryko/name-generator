import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
   name: "getApproxGenerationTime"
})
export class GetApproxGenerationTimePipe implements PipeTransform {
   private static readonly MIN_TIME_THRESHOLD = 100;
   private static readonly DISPLAY_MS_THRESHOLD = 800;

   public transform(approxGenerationTimePerName: number | null, generationTimes: number): string {
      if (approxGenerationTimePerName === null) {
         return "Cannot approximate generation time yet!";
      }

      const approxGenerationTimeMs = approxGenerationTimePerName * generationTimes;

      if (approxGenerationTimeMs < GetApproxGenerationTimePipe.MIN_TIME_THRESHOLD) {
         return "~ in the blink of an eye";
      }

      if (approxGenerationTimeMs < GetApproxGenerationTimePipe.DISPLAY_MS_THRESHOLD) {
         return `~ ${Math.round(approxGenerationTimeMs)}ms`;
      }

      const approxGenerationTimeS = approxGenerationTimeMs / 1000;
      return `~ ${approxGenerationTimeS.toFixed(1)}s`;
   }
}
