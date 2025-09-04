import { ChangeDetectionStrategy, Component, inject, Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router } from "@angular/router";
import { AboutSubpage } from "@ngen-about/about-subpage";
import { SidebarComponent } from "@ngen-shared/components";
import { RouteUrl } from "@ngen-shared/enums";
import { PageStateHandlerService } from "@ngen-shared/services";
import { Subject, take, takeUntil } from "rxjs";
import { BulkGenerationDialogData } from "./bulk-generation-dialog/bulk-generation-dialog-data.d";
import { BulkGenerationDialogComponent } from "./bulk-generation-dialog/bulk-generation-dialog.component";
import { GeneratorAlgorithmName } from "./core/enums";
import { GenerationData, GenerationErrors } from "./core/models";
import { GenerationConfigComponent } from "./generation-config/generation-config.component";
import { GenerationOutputComponent } from "./generation-output/generation-output.component";
import { ConfigurationStoreService } from "./services";
import { GenerationUtils } from "./utils";

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
   private readonly snackbar = inject(MatSnackBar);

   public readonly GENERATORS: { label: string; value: GeneratorAlgorithmName }[] = [];
   public readonly selectedGenerator: Signal<GeneratorAlgorithmName | undefined>;
   public generatedName?: string;
   public generationData?: GenerationData;
   private readonly nameGenerated$ = new Subject<void>();

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
      const generatorName = this.selectedGenerator();
      if (!generatorName) {
         return;
      }

      const generator = GenerationUtils.findAlgorithm(generatorName);
      const config = this.configurationStoreService.loadConfig(generatorName);
      [this.generatedName, this.generationData] = generator.generateName(config);
      this.nameGenerated$.next();
      this.displayGenerationErrors(this.generationData!.errors);
   }

   public openBulkGenerationDialog(): void {
      const algorithmName = this.selectedGenerator();
      if (!algorithmName) {
         return;
      }

      const config = this.configurationStoreService.loadConfig(algorithmName);
      this.dialog.open(BulkGenerationDialogComponent, {
         data: {
            algorithmName,
            config
         } satisfies BulkGenerationDialogData,
         disableClose: true
      });
   }

   public selectGenerator(generator: GeneratorAlgorithmName): void {
      this.pageStateHandlerService.setGenerator(generator);
   }

   private displayGenerationErrors(errors: GenerationErrors): void {
      const currentError = errors.shift();
      if (!currentError) {
         return;
      }

      const snackbarRef = this.snackbar.open(currentError, "Dismiss", { duration: 5000 });
      this.nameGenerated$.pipe(take(1), takeUntil(snackbarRef.afterDismissed())).subscribe(() => snackbarRef.dismiss());
      snackbarRef
         .afterDismissed()
         .pipe(take(1), takeUntil(this.nameGenerated$))
         .subscribe(() => this.displayGenerationErrors(errors));
   }
}
