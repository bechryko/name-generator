import { Injectable } from "@angular/core";
import { ErrorService } from "@ngen-core/error-handling";
import { GeneratedName } from "@ngen-database/models";
import { FirestoreService } from "@ngen-database/services";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TypedAction } from "@ngrx/store/src/models";
import { catchError, exhaustMap, map, take, tap } from "rxjs";
import { nameDatabaseActions } from "./name-database.actions";

@Injectable()
export class NameDatabaseEffects {
   public addName$ = createEffect(() =>
      this.actions$.pipe(
         ofType(nameDatabaseActions.addName),
         map(name => this.getPureName(name)),
         exhaustMap((name) => this.firestoreService.addName(name).pipe(
            map(successfulAction => successfulAction 
               ? nameDatabaseActions.addNameSuccess(name)
               : nameDatabaseActions.duplicateNameFailure({ name: name.name })
            ),
            catchError(error => [nameDatabaseActions.addNameFailure({ error })])
         ))
      )
   );

   public deleteName$ = createEffect(() =>
      this.actions$.pipe(
         ofType(nameDatabaseActions.deleteName),
         exhaustMap(({ name }) => this.firestoreService.deleteName(name).pipe(
            map(() => nameDatabaseActions.deleteNameSuccess({ name })),
            catchError(error => [nameDatabaseActions.deleteNameFailure({ error })])
         ))
      )
   );

   public syncNames$ = createEffect(() =>
      this.actions$.pipe(
         ofType(nameDatabaseActions.syncNames),
         exhaustMap(() => this.firestoreService.valueChanges$.pipe(
            take(1),
            map(names => nameDatabaseActions.syncNamesSuccess({ names })),
            catchError(error => [nameDatabaseActions.syncNamesFailure({ error })])
         ))
      )
   );

   public addNameFailure$ = createEffect(() =>
      this.actions$.pipe(
         ofType(nameDatabaseActions.addNameFailure),
         tap(({ error }) => this.errorService.popupError('database', 'ADD_FAILURE'))
      ), 
      { dispatch: false }
   );

   public duplicateNameFailure$ = createEffect(() =>
      this.actions$.pipe(
         ofType(nameDatabaseActions.duplicateNameFailure),
         tap(({ name }) => this.errorService.popupError('database', 'DUPLICATE_NAME'))
      ),
      { dispatch: false }
   );

   public deleteNameFailure$ = createEffect(() =>
      this.actions$.pipe(
         ofType(nameDatabaseActions.deleteNameFailure),
         tap(({ error }) => this.errorService.popupError('database', 'DELETE_FAILURE'))
      ),
      { dispatch: false }
   );

   public syncNamesFailure$ = createEffect(() =>
      this.actions$.pipe(
         ofType(nameDatabaseActions.syncNamesFailure),
         tap(({ error }) => this.errorService.popupError('database', 'SYNC_FAILURE'))
      ),
      { dispatch: false }
   );

   constructor(
      private readonly actions$: Actions,
      private readonly firestoreService: FirestoreService,
      private readonly errorService: ErrorService
   ) { }

   private getPureName(nameActionPayload: GeneratedName & TypedAction<string>): GeneratedName {
      const { type, ...name } = nameActionPayload;
      return name;
   }
}
