import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { SidebarComponent } from "@ngen-core/components";
import { Name } from "@ngen-core/names";
import { PageStateHandlerService } from "@ngen-core/services";
import { Observable } from "rxjs";
import { Generators } from "./enums";
import { GenerationConfigComponent } from "./generation-config/generation-config.component";
import { GenerationOutputComponent } from "./generation-output/generation-output.component";
import { JapaneseGeneratorService, RegularGeneratorService, SyllabicGeneratorService } from "./generator-algorithms";
import { GeneratorService } from "./generator-algorithms/generator-service.model";
import { LetterFinalizerService } from "./generator-algorithms/letter-finalization/letter-finalizer.service";
import { VoicedUnvoicedPairsUtils } from "./generator-algorithms/letter-finalization/utils";
import { ConfigurationStoreService } from "./services";

@Component({
   selector: "ngen-generation",
   templateUrl: "./generation.component.html",
   styleUrl: "./generation.component.scss",
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [SidebarComponent, GenerationConfigComponent, MatButton, GenerationOutputComponent, AsyncPipe],
   providers: [JapaneseGeneratorService, RegularGeneratorService, SyllabicGeneratorService, LetterFinalizerService]
})
export class GenerationComponent {
   private readonly pageStateHandlerService = inject(PageStateHandlerService);
   private readonly configurationStoreService = inject(ConfigurationStoreService);

   public readonly GENERATORS: { label: string; value: Generators }[] = [];
   public selectedGenerator$: Observable<Generators>;
   public generatedName?: Name;

   private generatorServices: Record<Generators, GeneratorService> = {
      [Generators.JAPANESE]: inject(JapaneseGeneratorService),
      [Generators.SYLLABIC]: inject(SyllabicGeneratorService),
      [Generators.REGULAR]: inject(RegularGeneratorService)
   };

   constructor() {
      this.selectedGenerator$ = this.pageStateHandlerService.generator$;
      for (const generator of Object.values(Generators)) {
         this.GENERATORS.push({ label: generator, value: generator });
      }

      VoicedUnvoicedPairsUtils.initPairs();
   }

   public generateName(generator: Generators): void {
      this.generatedName = this.generatorServices[generator].generateName(
         this.configurationStoreService.loadConfig(generator)
      );
   }

   public selectGenerator(generator: Generators): void {
      this.pageStateHandlerService.setGenerator(generator);
   }
}
