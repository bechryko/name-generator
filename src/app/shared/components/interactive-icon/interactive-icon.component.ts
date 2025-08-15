import { ChangeDetectionStrategy, Component, inject, input, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTooltipModule, TooltipPosition } from "@angular/material/tooltip";
import { GeneratorAlgorithmName } from "@ngen-generation/core/enums";
import { ClipboardService, PageStateHandlerService } from "@ngen-shared/services";
import { BehaviorSubject } from "rxjs";

type InteractiveIconType = "clipboard" | "saveName" | "delete";

interface InteractiveIconTypeDescription {
   icon: string;
   tooltip: string;
   clickEvent?: (data: any) => void;
}

@Component({
   selector: "ngen-interactive-icon",
   templateUrl: "./interactive-icon.component.html",
   styleUrl: "./interactive-icon.component.scss",
   imports: [MatButtonModule, MatIconModule, MatTooltipModule, MatSnackBarModule],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class InteractiveIconComponent {
   private readonly pageStateHandlerService = inject(PageStateHandlerService);
   private readonly clipboard = inject(ClipboardService);

   public readonly type = input.required<InteractiveIconType>();
   public readonly data = input<any>();
   public readonly tooltipPosition = input<TooltipPosition>("below");
   public readonly isButton = input(true);
   public readonly iconClick = output<Event>();
   private readonly selectedGenerator$ = new BehaviorSubject<GeneratorAlgorithmName>(GeneratorAlgorithmName.JAPANESE);

   public readonly ICONS: Record<InteractiveIconType, InteractiveIconTypeDescription> = {
      clipboard: {
         icon: "content_copy",
         tooltip: "Copy name to clipboard",
         clickEvent: (name: string) => this.clipboard.copy(name, "Name copied to clipboard!")
      },
      saveName: {
         icon: "queue",
         tooltip: "Save name to database"
         // clickEvent: (name: string) => this.nameDatabaseService.addName(name, this.selectedGenerator$.value)
      },
      delete: {
         icon: "delete",
         tooltip: "Delete"
      }
   };

   constructor() {
      this.pageStateHandlerService.generator$.subscribe(this.selectedGenerator$);
   }

   public onClick(event: Event): void {
      this.iconClick.emit(event);
      this.ICONS[this.type()].clickEvent?.(this.data());
   }
}
