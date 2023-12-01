import { Clipboard } from '@angular/cdk/clipboard';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
   providedIn: 'root'
})
export class ClipboardService {
   constructor(
      private readonly clipboard: Clipboard,
      private readonly snackbar: MatSnackBar
   ) { }

   public copy(textToCopy: string, popupMessage?: string): void {
      this.clipboard.copy(textToCopy);
      if (popupMessage) {
         this.snackbar.open(popupMessage, 'Dismiss', {
            duration: 3000
         });
      }
   }
}
