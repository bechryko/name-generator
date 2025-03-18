import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClipboardService, PageStateHandlerService } from '@ngen-core/services';
import { NameDatabaseService } from '@ngen-database/services';
import { Generators } from '@ngen-generation/enums';
import { NgLetModule } from 'ng-let';
import { BehaviorSubject } from 'rxjs';

type InteractiveIconType = 'clipboard' | 'saveName';

interface InteractiveIconTypeDescription {
  icon: string;
  tooltip: string;
  clickEvent?: (data: any) => void;
}

@Component({
  selector: 'ngen-interactive-icon',
  templateUrl: './interactive-icon.component.html',
  styleUrl: './interactive-icon.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    NgLetModule
  ]
})
export class InteractiveIconComponent {
  @Input() type: InteractiveIconType = 'clipboard';
  @Input() data: any;
  @Input() tooltipPosition: 'above' | 'below' | 'left' | 'right' = 'below';
  @Output() click: EventEmitter<Event> = new EventEmitter<Event>();
  private readonly selectedGenerator$ = new BehaviorSubject<Generators>(Generators.JAPANESE);

  public readonly ICONS: Record<InteractiveIconType, InteractiveIconTypeDescription> = {
    clipboard: {
      icon: 'content_copy',
      tooltip: 'Copy name to clipboard',
      clickEvent: (name: string) => this.clipboard.copy(name, "Name copied to clipboard!")
    },
    saveName: {
      icon: 'queue',
      tooltip: 'Save name to database',
      clickEvent: (name: string) => this.nameDatabaseService.addName(name, this.selectedGenerator$.value)
    }
  };

  constructor(
    private readonly nameDatabaseService: NameDatabaseService,
    private readonly pageStateHandlerService: PageStateHandlerService ,
    private readonly clipboard: ClipboardService
  ) {
    this.pageStateHandlerService.generator$.subscribe(this.selectedGenerator$);
  }

  public onClick(event: Event): void {
    this.click.emit(event);
    this.ICONS[this.type].clickEvent?.(this.data);
  }
}
