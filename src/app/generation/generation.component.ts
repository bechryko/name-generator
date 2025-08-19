import { ChangeDetectionStrategy, Component, computed, inject, Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router } from "@angular/router";
import { AboutSubpage } from "@ngen-about/about-subpage";
import { SidebarComponent } from "@ngen-shared/components";
import { RouteUrl } from "@ngen-shared/enums";
import { PageStateHandlerService } from "@ngen-shared/services";
import { BulkGenerationDialogComponent } from "./bulk-generation-dialog/bulk-generation-dialog.component";
import {
   japaneseGeneratorAlgorithm,
   phoneticGeneratorAlgorithm,
   regularGeneratorAlgorithm,
   syllabicGeneratorAlgorithm
} from "./core/algorithms";
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
   imports: [
      SidebarComponent,
      GenerationConfigComponent,
      MatButtonModule,
      GenerationOutputComponent,
      MatIconModule,
      MatTooltipModule
   ]
})
export class GenerationComponent {
   private readonly pageStateHandlerService = inject(PageStateHandlerService);
   private readonly configurationStoreService = inject(ConfigurationStoreService);
   private readonly dialog = inject(MatDialog);
   private readonly router = inject(Router);

   public readonly GENERATORS: { label: string; value: GeneratorAlgorithmName }[] = [];
   public readonly selectedGenerator: Signal<GeneratorAlgorithmName | undefined>;
   public readonly generationFn = computed(() => {
      const generator = this.selectedGenerator();
      if (!generator) {
         return null;
      }

      return () => this.findAlgorithm(generator).generateName(this.configurationStoreService.loadConfig(generator));
   });
   public generatedName?: string;
   public generationData?: GenerationData;
   private readonly generatorAlgorithms = [
      japaneseGeneratorAlgorithm,
      regularGeneratorAlgorithm,
      syllabicGeneratorAlgorithm,
      phoneticGeneratorAlgorithm
   ];

   constructor() {
      this.selectedGenerator = toSignal(this.pageStateHandlerService.generator$);
      for (const generator of Object.values(GeneratorAlgorithmName)) {
         this.GENERATORS.push({ label: generator, value: generator });
      }
   }

   public navigateToInfoPage(): void {
      this.router.navigateByUrl(RouteUrl.ABOUT + "/" + AboutSubpage.GENERATORS);
   }

   public generateName(): void {
      const generationFn = this.generationFn();
      if (!generationFn) {
         return;
      }

      [this.generatedName, this.generationData] = generationFn();
   }

   public openBulkGenerationDialog(): void {
      const generationFn = this.generationFn();
      if (!generationFn) {
         return;
      }

      this.dialog.open(BulkGenerationDialogComponent, {
         data: generationFn
      });
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
