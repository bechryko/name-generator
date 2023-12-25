import { AfterViewInit, Component, Input, ViewChild, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { pluck } from '@ngen-core/functions';
import { ClipboardService } from '@ngen-core/services';
import { AuthService } from '@ngen-core/services/auth.service';
import { GeneratedName } from '@ngen-database/models';
import { NameDatabaseService } from '@ngen-database/services';
import { BehaviorSubject, filter, fromEvent, map, merge, withLatestFrom } from 'rxjs';
import { NameDatabaseTableHeader } from './models';

@Component({
   selector: 'ngen-name-database-table',
   templateUrl: './name-database-table.component.html',
   styleUrl: './name-database-table.component.scss'
})
export class NameDatabaseTableComponent implements AfterViewInit {
   private readonly DELETE_KEY = "Control";

   public _headers: NameDatabaseTableHeader[] = [];
   public headerKeys = signal<(keyof GeneratedName)[]>([]);
   @Input() set headers(headers: NameDatabaseTableHeader[]) {
      this._headers = headers;
      this.headerKeys.set(pluck(headers, 'key'));
   }

   public dataSource = signal(new MatTableDataSource<GeneratedName>());
   @Input() set data(data: GeneratedName[]) {
      this.dataSource.set(new MatTableDataSource(data));
      this.setSort();
   }

   @ViewChild(MatSort) sort?: MatSort;
   public ngAfterViewInit(): void {
      this.setSort();
   }

   public deleteMode$ = new BehaviorSubject<boolean>(false);

   constructor(
      private readonly nameDatabaseService: NameDatabaseService,
      private readonly clipboard: ClipboardService,
      private readonly authService: AuthService
   ) {
      merge(
         fromEvent<KeyboardEvent>(document, 'keydown').pipe(
            filter((event: KeyboardEvent) => event.key === this.DELETE_KEY)
         ),
         fromEvent<KeyboardEvent>(document, 'keyup').pipe(
            filter((event: KeyboardEvent) => event.key === this.DELETE_KEY)
         )
      ).pipe(
         takeUntilDestroyed(),
         withLatestFrom(this.authService.developerLoggedIn$),
         map(([event, isDeveloperLoggedIn]) => event.type === 'keydown' && isDeveloperLoggedIn)
      ).subscribe(this.deleteMode$);
   }

   public onRowClick(name: GeneratedName): void {
      if (this.deleteMode$.value) {
         this.nameDatabaseService.deleteName(name.name);
      } else {
         this.clipboard.copy(name.name, "Name copied to clipboard!");
      }
   }

   public getKey(header: NameDatabaseTableHeader): string {
      return header.key as string;
   }

   private setSort(): void {
      if (this.sort) {
         this.dataSource().sort = this.sort;
      }
   }
}
