import { Injectable } from '@angular/core';
import { APP_VERSION } from '@ngen-core/constants';
import { GeneratedName } from '@ngen-database/models';
import { nameDatabaseActions, nameDatabaseFeature } from '@ngen-database/store';
import { Generators } from '@ngen-generation/enums';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NameDatabaseService {
  public readonly names$: Observable<GeneratedName[]>;

  constructor(
    private readonly store: Store
  ) {
    this.names$ = this.store.select(nameDatabaseFeature.selectEntities).pipe(
      map(entities => Object.values(entities) as GeneratedName[])
    );
  }

  public syncNames(): void {
    this.store.dispatch(nameDatabaseActions.syncNames());
  }

  public addName(name: string, generationAlgorithm: Generators): void {
    this.store.dispatch(nameDatabaseActions.addName({
      name,
      generationAlgorithm,
      version: APP_VERSION
    }));
  }

  public deleteName(name: string): void {
    this.store.dispatch(nameDatabaseActions.deleteName({ name }));
  }
}
