import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NameDatabaseService } from '@ngen-database/services';
import { DatabaseRoutingModule } from './database-routing.module';
import { DatabaseComponent } from './database.component';
import { NameDatabaseTableComponent } from './name-database-table/name-database-table.component';


@NgModule({
  declarations: [
    DatabaseComponent,
    NameDatabaseTableComponent
  ],
  imports: [
    CommonModule,
    DatabaseRoutingModule,
    MatTableModule,
    MatSortModule
  ]
})
export class DatabaseModule {
  constructor(
    private readonly nameDatabaseService: NameDatabaseService
  ) {
    this.nameDatabaseService.syncNames();
  }
}
