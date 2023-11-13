import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(
    private readonly errorSnackbar: MatSnackBar
  ) { }

  public popupError(source: string, message: string): void {
    this.errorSnackbar.open(`[${source}]\n${message}`, "Dismiss", {
      duration: 4000
    });
  }
}
