import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
   selector: "ngen-bulk-generation-dialog-exit-confirmation",
   templateUrl: "./bulk-generation-dialog-exit-confirmation.component.html",
   styleUrl: "./bulk-generation-dialog-exit-confirmation.component.scss",
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [MatButtonModule]
})
export class BulkGenerationDialogExitConfirmationComponent {
   public readonly generatedNames: number = inject(MAT_DIALOG_DATA);
   private readonly dialogRef = inject(MatDialogRef);

   public confirm(): void {
      this.dialogRef.close(true);
   }

   public cancel(): void {
      this.dialogRef.close(false);
   }
}
