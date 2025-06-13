import { Component } from "@angular/core";
import { of } from "rxjs";
import { GeneratedName } from "./models";
import { NameDatabaseTableHeader } from "./name-database-table/models";

@Component({
   selector: "ngen-database",
   templateUrl: "./database.component.html",
   styleUrl: "./database.component.scss"
})
export class DatabaseComponent {
   public readonly nameDatabaseHeaders: NameDatabaseTableHeader[] = [
      {
         label: "Name",
         key: "name",
         enableSort: true
      },
      {
         label: "Algorithm",
         key: "generationAlgorithm",
         enableSort: true
      },
      {
         label: "Version",
         key: "version",
         enableSort: true
      }
   ];
   public readonly names$ = of<GeneratedName[]>([]);
}
