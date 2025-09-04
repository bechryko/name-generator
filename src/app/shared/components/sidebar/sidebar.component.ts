import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule, TooltipPosition } from "@angular/material/tooltip";
import { Breakpoint } from "@ngen-shared/enums";
import { NgenSidebarSelectable } from "@ngen-shared/models";
import { MediaQueryUtils } from "@ngen-shared/utils";
import { fromEvent } from "rxjs";

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
   public tooltipPosition = this.calculateTooltipPosition();

   constructor() {
      fromEvent(window, "resize")
         .pipe(takeUntilDestroyed())
         .subscribe(() => {
            this.tooltipPosition = this.calculateTooltipPosition();
         });
   }

   public onSelect(value: T): void {
      this.select.emit(value);
   }

   private calculateTooltipPosition(): TooltipPosition {
      return MediaQueryUtils.maxWidth(Breakpoint.SMALL_WIDTH) ? "below" : "right";
   }
}
