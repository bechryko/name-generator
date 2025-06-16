import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { APP_NAME, APP_VERSION } from "@ngen-core/constants";
import { HeaderComponent } from "./header/header.component";

@Component({
   selector: "app-root",
   templateUrl: "./app.component.html",
   styleUrls: ["./app.component.scss"],
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [HeaderComponent, RouterOutlet]
})
export class AppComponent {
   constructor() {
      document.title = `${APP_NAME} Name Generator (${APP_VERSION})`;
   }
}
