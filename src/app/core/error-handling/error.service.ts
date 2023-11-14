import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorMessageId } from './error-message-id';
import { ErrorMessages } from './error-messages';
import { ErrorSource } from './error-source';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(
    private readonly errorSnackbar: MatSnackBar
  ) { }

  public popupError<T extends ErrorSource>(source: T, messageId: ErrorMessageId<T>): void {
    this.errorSnackbar.open(`[${ source }]\n${ ErrorMessages[source][messageId] }`, "Dismiss", {
      duration: 6000
    });
  }
}
