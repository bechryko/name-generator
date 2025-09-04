import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { GenerationUtils } from "@ngen-generation/utils";
import { InteractiveIconComponent } from "@ngen-shared/components";
import { Stopwatch } from "@ngen-shared/models";
import { BulkGenerationDialogData } from "./bulk-generation-dialog-data";
import { BulkGenerationWorkerData, GeneratedName } from "./models";
import { GetApproxGenerationTimePipe } from "./pipes";
import { BulkGenerationWorkerUtils } from "./worker/bulk-generation.worker.utils";

@Component({
   selector: "ngen-bulk-generation-dialog",
   templateUrl: "./bulk-generation-dialog.component.html",
   styleUrl: "./bulk-generation-dialog.component.scss",
   imports: [MatButtonModule, InteractiveIconComponent, MatProgressSpinnerModule, GetApproxGenerationTimePipe],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class BulkGenerationDialogComponent {
   private static readonly GENERATION_TIME_APPROXIMATION_NAME_THRESHOLD = 100;

   private readonly data: BulkGenerationDialogData = inject(MAT_DIALOG_DATA);
   private readonly dialogRef = inject(MatDialogRef);

   public readonly maxGenerationTimes = 2_000;
   public readonly generationTimes = signal(5);
   public readonly generatedNames = signal<GeneratedName[]>([]);
   public readonly isLoading = signal(false);
   public readonly approxGenerationTimePerName = signal<number | null>(null);
   public readonly generatedNamesContainerRef = viewChild.required<ElementRef<HTMLElement>>("generatedNamesContainer");
   private readonly worker = this.initWorker();
   private readonly stopwatch = new Stopwatch();
   private totalGenerationTime = 0;
   private totalNamesGenerated = 0;

   public onGenerationTimesChange(event: any): void {
      const value: number = event.target.value;
      const clampedRoundedValue = Math.max(1, Math.min(this.maxGenerationTimes, Math.round(value)));
      this.generationTimes.set(clampedRoundedValue);
   }

   public close(): void {
      this.dialogRef.close();
   }

   public generateNames(): void {
      const workerData: BulkGenerationWorkerData = {
         algorithmName: this.data.algorithmName,
         generationTimes: this.generationTimes(),
         configJSON: GenerationUtils.configToJSON(this.data.config)
      };

      this.isLoading.set(true);
      this.stopwatch.start();
      if (this.worker) {
         this.worker.postMessage(workerData);
      } else {
         this.onGenerationComplete(BulkGenerationWorkerUtils.generate(workerData));
      }
   }

   public deleteName(index: number): void {
      this.generatedNames.update(names => names.filter((_, idx) => idx !== index));
   }

   private onGenerationComplete(names: GeneratedName[]): void {
      this.totalGenerationTime += this.stopwatch.stop();
      this.totalNamesGenerated += names.length;

      this.generatedNames.update(oldNames => [...oldNames, ...names]);
      this.isLoading.set(false);

      if (this.isScrolledToBottom) {
         setTimeout(() => this.scrollToBottom(), 0);
      }

      this.setApproxGenerationTime();
   }

   private setApproxGenerationTime(): void {
      if (this.totalNamesGenerated < BulkGenerationDialogComponent.GENERATION_TIME_APPROXIMATION_NAME_THRESHOLD) {
         return;
      }

      this.approxGenerationTimePerName.set(this.totalGenerationTime / this.totalNamesGenerated);
   }

   private scrollToBottom(): void {
      this.generatedNamesContainer.scrollBy({
         top:
            this.generatedNamesContainer.scrollHeight -
            this.generatedNamesContainer.scrollTop -
            this.generatedNamesContainer.clientHeight,
         behavior: "smooth"
      });
   }

   private get isScrolledToBottom(): boolean {
      return (
         this.generatedNamesContainer.scrollHeight - this.generatedNamesContainer.scrollTop ===
         this.generatedNamesContainer.clientHeight
      );
   }

   private get generatedNamesContainer(): HTMLElement {
      return this.generatedNamesContainerRef().nativeElement;
   }

   private initWorker(): Worker | null {
      if (typeof Worker === undefined) {
         return null;
      }

      const worker = new Worker(new URL("./worker/bulk-generation.worker", import.meta.url));
      worker.onmessage = ({ data }: { data: GeneratedName[] }) => this.onGenerationComplete(data);
      return worker;
   }
}
