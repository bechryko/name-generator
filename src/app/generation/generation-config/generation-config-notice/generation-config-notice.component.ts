import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { GeneratorAlgorithmName } from "@ngen-generation/core/enums";

@Component({
   selector: "ngen-generation-config-notice",
   templateUrl: "./generation-config-notice.component.html",
   styleUrl: "./generation-config-notice.component.scss",
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenerationConfigNoticeComponent {
   public static shouldBeDisplayed(generatorAlgorithm: GeneratorAlgorithmName): boolean {
      return generatorAlgorithm === GeneratorAlgorithmName.PHONETIC;
   }

   public readonly GeneratorAlgorithmName = GeneratorAlgorithmName;
   public readonly algorithm = input.required<GeneratorAlgorithmName>();
}
