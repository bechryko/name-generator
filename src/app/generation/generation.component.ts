import { ChangeDetectionStrategy, Component, inject, Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButton } from "@angular/material/button";
import { SidebarComponent } from "@ngen-shared/components";
import { PageStateHandlerService } from "@ngen-shared/services";
import { japaneseGeneratorAlgorithm, regularGeneratorAlgorithm, syllabicGeneratorAlgorithm } from "./core/algorithms";
import { GeneratorAlgorithmName } from "./core/enums";
import { GenerationData, NameGeneratorAlgorithm } from "./core/models";
import { GenerationConfigComponent } from "./generation-config/generation-config.component";
import { GenerationOutputComponent } from "./generation-output/generation-output.component";
import { ConfigurationStoreService } from "./services";

@Component({
   selector: "ngen-generation",
   templateUrl: "./generation.component.html",
   styleUrl: "./generation.component.scss",
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [SidebarComponent, GenerationConfigComponent, MatButton, GenerationOutputComponent]
})
export class GenerationComponent {
   private readonly pageStateHandlerService = inject(PageStateHandlerService);
   private readonly configurationStoreService = inject(ConfigurationStoreService);

   public readonly GENERATORS: { label: string; value: GeneratorAlgorithmName }[] = [];
   public readonly selectedGenerator: Signal<GeneratorAlgorithmName | undefined>;
   public generatedName?: string;
   public generationData?: GenerationData;
   private readonly generatorAlgorithms = [
      japaneseGeneratorAlgorithm,
      regularGeneratorAlgorithm,
      syllabicGeneratorAlgorithm
   ];

   constructor() {
      this.selectedGenerator = toSignal(this.pageStateHandlerService.generator$);
      for (const generator of Object.values(GeneratorAlgorithmName)) {
         this.GENERATORS.push({ label: generator, value: generator });
      }
   }

   public generateName(generator: GeneratorAlgorithmName): void {
      [this.generatedName, this.generationData] = this.findAlgorithm(generator).generateName(
         this.configurationStoreService.loadConfig(generator)
      );
   }

   public selectGenerator(generator: GeneratorAlgorithmName): void {
      this.pageStateHandlerService.setGenerator(generator);
   }

   private findAlgorithm(algorithmName: GeneratorAlgorithmName): NameGeneratorAlgorithm {
      const algorithm = this.generatorAlgorithms.find(algorithm => algorithm.name === algorithmName);
      if (!algorithm) {
         throw new Error("Cannot find generator algorithm: " + algorithmName);
      }
      return algorithm;
   }
}
