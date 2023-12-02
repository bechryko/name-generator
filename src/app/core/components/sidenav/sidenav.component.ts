import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgenSidebarSelectable } from '@ngen-core/models';

@Component({
   selector: 'ngen-sidenav',
   templateUrl: './sidenav.component.html',
   styleUrl: './sidenav.component.scss',
   standalone: true,
   imports: [
      MatButtonModule,
      MatTooltipModule
   ]
})
export class SidenavComponent<T> {
   @Input() selectableList: NgenSidebarSelectable<T>[] = [];
   @Input() selectedValue?: T;
   @Input() placeholderText: string = '';
   @Output() select = new EventEmitter<T>();

   public onSelect(value: T): void {
      this.select.emit(value);
   }
}
