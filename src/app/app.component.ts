import { ChangeDetectionStrategy, Component } from "@angular/core";
import { APP_NAME, APP_VERSION } from "@ngen-core/constants";

@Component({
   selector: "app-root",
   templateUrl: "./app.component.html",
   styleUrls: ["./app.component.scss"],
   changeDetection: ChangeDetectionStrategy.OnPush,
   standalone: false
})
export class AppComponent {
   constructor() {
      document.title = `${APP_NAME} Name Generator (${APP_VERSION})`;
   }
}
