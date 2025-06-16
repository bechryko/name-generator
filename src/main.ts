import { MatSnackBar } from "@angular/material/snack-bar";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";

import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, {
   providers: [MatSnackBar, provideAnimations()]
}).catch(err => console.error(err));
