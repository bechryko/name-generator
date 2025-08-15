import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
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

   public onGenerationTimesChange(event: any): void {
      const value: number = event.target.value;
      const clampedRoundedValue = Math.max(1, Math.min(100, Math.round(value)));
      this.generationTimes.set(clampedRoundedValue);
   }

   public generateName(): void {
      for (let i = 0; i < this.generationTimes(); i++) {
         this.generatedNames.push(this.generationFn());
      }
   }

   public deleteName(index: number): void {
      this.generatedNames.splice(index, 1);
   }

   public exit(): void {
      this.dialogRef.close();
   }
}
