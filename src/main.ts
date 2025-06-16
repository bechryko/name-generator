import { MatSnackBar } from "@angular/material/snack-bar";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { routes } from "app/app.routes";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, {
   providers: [MatSnackBar, provideAnimations(), provideRouter(routes)]
}).catch(err => console.error(err));
