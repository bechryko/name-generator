import { AfterViewInit, Component, Input, ViewChild, signal } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatabaseTableHeader } from './models';

@Component({
  selector: 'ngen-database-table',
  templateUrl: './database-table.component.html',
  styleUrl: './database-table.component.scss'
})
export class DatabaseTableComponent<T> implements AfterViewInit {
  public _headers: DatabaseTableHeader<T>[] = [];
  public headerKeys = signal<(keyof T)[]>([]);
  @Input() set headers(headers: DatabaseTableHeader<T>[]) {
    this._headers = headers;
    this.headerKeys.set(headers.map((header) => header.key));
  }

  public dataSource = signal(new MatTableDataSource<T>());
  @Input() set data(data: T[]) {
    this.dataSource.set(new MatTableDataSource(data));
    this.setSort();
  }

  @ViewChild(MatSort) sort?: MatSort;
  public ngAfterViewInit(): void {
    this.setSort();
  }

  public getKey(header: DatabaseTableHeader<T>): string {
    return header.key as string;
  }

  private setSort(): void {
    if(this.sort) {
      this.dataSource().sort = this.sort;
    }
  }
}
