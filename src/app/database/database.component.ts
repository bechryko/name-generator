import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneratedName } from './models';
import { NameDatabaseTableHeader } from './name-database-table/models';
import { NameDatabaseService } from './services';

@Component({
   selector: 'ngen-database',
   templateUrl: './database.component.html',
   styleUrl: './database.component.scss'
})
export class DatabaseComponent {
   public readonly nameDatabaseHeaders: NameDatabaseTableHeader[] = [
      {
         label: "Name",
         key: 'name',
         enableSort: true
      },
      {
         label: "Algorithm",
         key: 'generationAlgorithm',
         enableSort: true
      },
      {
         label: "Version",
         key: 'version',
         enableSort: true
      }
   ];
   public readonly names$: Observable<GeneratedName[]>;

   constructor(
      private readonly nameDatabaseService: NameDatabaseService
   ) {
      this.names$ = this.nameDatabaseService.names$;
   }
}
