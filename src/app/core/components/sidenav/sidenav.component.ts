import { Component, EventEmitter, Input, Output } from '@angular/core';

interface NgenSidebarSelectable<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'ngen-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  standalone: true
})
export class SidenavComponent<T> {
  @Input() selectableList: NgenSidebarSelectable<T>[] = [];
  @Input() placeholderText: string = '';
  @Output() select = new EventEmitter<T>();

  public onSelect(value: T): void {
    this.select.emit(value);
  }
}
