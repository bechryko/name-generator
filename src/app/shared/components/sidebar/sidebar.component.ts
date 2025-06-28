import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgenSidebarSelectable } from "@ngen-shared/models";

@Component({
   selector: "ngen-sidebar",
   templateUrl: "./sidebar.component.html",
   styleUrl: "./sidebar.component.scss",
   imports: [MatButtonModule, MatTooltipModule],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent<T> {
   public readonly selectableList = input.required<NgenSidebarSelectable<T>[]>();
   public readonly selectedValue = input<T>();
   public readonly placeholderText = input("");
   public readonly select = output<T>();

   public onSelect(value: T): void {
      this.select.emit(value);
   }
}
