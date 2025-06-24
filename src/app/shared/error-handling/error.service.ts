import { Injectable, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { capitalize } from "@ngen-shared/functions";
import { ErrorMessageId } from "./error-message-id";
import { ErrorMessages } from "./error-messages";
import { ErrorSource } from "./error-source";

@Injectable({
   providedIn: "root"
})
export class ErrorService {
   private readonly errorSnackbar = inject(MatSnackBar);

   /**
    * Pops up a snackbar displaying the given error message.
    *
    * @param source - The source of the error
    * @param messageId - The ID of the error message based on the source
    */
   public popupError<T extends ErrorSource>(source: T, messageId: ErrorMessageId<T>): void {
      this.errorSnackbar.open(`[${capitalize(source)}]\n${ErrorMessages[source][messageId]}`, "Dismiss", {
         duration: 6000,
         panelClass: "ngen-error-snackbar"
      });
   }
}
