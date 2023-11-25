import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, collection, collectionChanges, deleteDoc, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { GeneratedName } from '@ngen-database/models';
import { Observable, exhaustMap, from, iif, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private static readonly COLLECTION_NAME = "names";

  private readonly collection: CollectionReference<GeneratedName, GeneratedName>;
  public readonly valueChanges$: Observable<GeneratedName[]>;

  constructor(
    private readonly firestore: Firestore
  ) {
    this.collection = collection(this.firestore, FirestoreService.COLLECTION_NAME).withConverter({
      toFirestore: (name: GeneratedName) => name,
      fromFirestore: (snapshot: DocumentData) => snapshot as GeneratedName
    });
    this.valueChanges$ = collectionChanges(this.collection).pipe(
      map(changes => 
        changes.map((change: any) => change.doc.data().data())
      )
    );
  }

  public addName(generatedName: GeneratedName): Observable<boolean> {
    const document = doc(this.collection, generatedName.name);
    const documentExists$ = from(getDoc(document)).pipe(
      map(document => document.exists()),
    );
    return documentExists$.pipe(
      exhaustMap(documentExists => 
        iif(() => 
          !documentExists,
          from(setDoc(document, generatedName)).pipe(
            map(() => true)
          ),
          of(false)
        )
      )
    );
  }

  public deleteName(name: string): Observable<void> {
    const document = doc(this.collection, name);
    return from(deleteDoc(document));
  }
}
