import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { HeaderComponent } from "./header.component";

@NgModule({
   imports: [CommonModule, MatButtonModule, HeaderComponent],
   exports: [HeaderComponent]
})
export class HeaderModule {}
