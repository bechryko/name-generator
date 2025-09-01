import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { GenerationUtils } from "@ngen-generation/utils";
import { InteractiveIconComponent } from "@ngen-shared/components";
import { BulkGenerationDialogData } from "./bulk-generation-dialog-data";
import { BulkGenerationWorkerData, GeneratedName } from "./models";
import { BulkGenerationWorkerUtils } from "./worker/bulk-generation.worker.utils";

@Component({
   selector: "ngen-bulk-generation-dialog",
   imports: [MatButtonModule, InteractiveIconComponent, MatProgressSpinnerModule],
   templateUrl: "./bulk-generation-dialog.component.html",
   styleUrl: "./bulk-generation-dialog.component.scss",
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class BulkGenerationDialogComponent {
   private readonly data: BulkGenerationDialogData = inject(MAT_DIALOG_DATA);
   private readonly dialogRef = inject(MatDialogRef);

   public readonly maxGenerationTimes = 2_000;
   public readonly generationTimes = signal(5);
   public readonly generatedNames = signal<GeneratedName[]>([]);
   public readonly isLoading = signal(false);
   public readonly generatedNamesContainerRef = viewChild.required<ElementRef<HTMLElement>>("generatedNamesContainer");
   private readonly worker = this.initWorker();

   public onGenerationTimesChange(event: any): void {
      const value: number = event.target.value;
      const clampedRoundedValue = Math.max(1, Math.min(this.maxGenerationTimes, Math.round(value)));
      this.generationTimes.set(clampedRoundedValue);
   }

   public generateNames(): void {
      const workerData: BulkGenerationWorkerData = {
         algorithmName: this.data.algorithmName,
         generationTimes: this.generationTimes(),
         configJSON: GenerationUtils.configToJSON(this.data.config)
      };

      this.isLoading.set(true);
      if (this.worker) {
         this.worker.postMessage(workerData);
      } else {
         this.onGenerationComplete(BulkGenerationWorkerUtils.generate(workerData));
      }
   }

   public deleteName(index: number): void {
      this.generatedNames.update(names => names.filter((_, idx) => idx !== index));
   }

   public exit(): void {
      this.dialogRef.close();
   }

   private onGenerationComplete(names: GeneratedName[]): void {
      this.generatedNames.update(oldNames => [...oldNames, ...names]);
      this.isLoading.set(false);

      if (this.isScrolledToBottom) {
         setTimeout(() => this.scrollToBottom(), 0);
      }
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
