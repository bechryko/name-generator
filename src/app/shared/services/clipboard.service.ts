import { Clipboard } from "@angular/cdk/clipboard";
import { Injectable, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
   providedIn: "root"
})
export class ClipboardService {
   private readonly clipboard = inject(Clipboard);
   private readonly snackbar = inject(MatSnackBar);

   public copy(textToCopy: string, popupMessage?: string): void {
      this.clipboard.copy(textToCopy);
      if (popupMessage) {
         this.snackbar.open(popupMessage, "Dismiss", {
            duration: 3000
         });
      }
   }
}
