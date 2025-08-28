import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { GenerationData } from "@ngen-generation/core/models";
import { InteractiveIconComponent } from "@ngen-shared/components";

type GeneratedName = [string, GenerationData];

@Component({
   selector: "ngen-bulk-generation-dialog",
   imports: [MatButtonModule, InteractiveIconComponent],
   templateUrl: "./bulk-generation-dialog.component.html",
   styleUrl: "./bulk-generation-dialog.component.scss",
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class BulkGenerationDialogComponent {
   private readonly generationFn: () => GeneratedName = inject(MAT_DIALOG_DATA);
   private readonly dialogRef = inject(MatDialogRef);

   public readonly generationTimes = signal(5);
   public readonly generatedNames: GeneratedName[] = [];
   public readonly generatedNamesContainerRef = viewChild.required<ElementRef<HTMLElement>>("generatedNamesContainer");

   public onGenerationTimesChange(event: any): void {
      const value: number = event.target.value;
      const clampedRoundedValue = Math.max(1, Math.min(100, Math.round(value)));
      this.generationTimes.set(clampedRoundedValue);
   }

   public generateNames(): void {
      for (let i = 0; i < this.generationTimes(); i++) {
         this.generatedNames.push(this.generationFn());
      }

      if (this.isScrolledToBottom) {
         setTimeout(() => this.scrollToBottom(), 0);
      }
   }

   public deleteName(index: number): void {
      this.generatedNames.splice(index, 1);
   }

   public exit(): void {
      this.dialogRef.close();
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
}
