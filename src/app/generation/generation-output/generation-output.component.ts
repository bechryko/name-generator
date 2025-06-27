import { ChangeDetectionStrategy, Component, computed, effect, input } from "@angular/core";
import { GenerationData } from "@ngen-generation/core/models";
import { GeneratorAlgorithmName } from "@ngen-generation/enums";
import { InteractiveIconComponent } from "@ngen-shared/components";

@Component({
   selector: "ngen-generation-output",
   templateUrl: "./generation-output.component.html",
   styleUrl: "./generation-output.component.scss",
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [InteractiveIconComponent]
})
export class GenerationOutputComponent {
   public readonly generatedName = input.required<string | null>();
   public readonly generationData = input.required<GenerationData | null>();
   public readonly generator = input.required<GeneratorAlgorithmName>();
   private currentGenerator?: GeneratorAlgorithmName;

   constructor() {
      effect(() => (this.currentGenerator = this.generator()));
   }

   public readonly displayedGenerationData = computed(() => {
      const data = this.generationData();
      if (!data || !this.currentGenerator) {
         return [];
      }

      const displayedData: Array<[string, string]> = [];
      switch (this.currentGenerator) {
         case GeneratorAlgorithmName.JAPANESE:
            displayedData.push(["Katakana", data.katakana!]);
            displayedData.push(["Hiragana", data.hiragana!]);
            break;
         case GeneratorAlgorithmName.SYLLABIC:
            displayedData.push(["Syllabized", data.syllabized!]);
            break;
         case GeneratorAlgorithmName.REGULAR:
            displayedData.push(["Regular", data.regularTemplate!]);
            break;
      }
      return displayedData;
   });
}
