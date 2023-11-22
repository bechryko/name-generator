import { Injectable } from '@angular/core';
import { AboutSubpages } from '@ngen-about/about-subpages';
import { multicast } from '@ngen-core/operators';
import { pageActions, pageFeature } from '@ngen-core/store';
import { Generators } from '@ngen-generation/enums';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: "root"
})
export class PageStateHandlerService {
  public readonly generator$ = this.store.select(pageFeature.selectGenerator).pipe(multicast());
  public readonly aboutSubpage$ = this.store.select(pageFeature.selectAboutSubpage).pipe(multicast());

  constructor(
    private readonly store: Store
  ) {}

  public setGenerator(generator: Generators): void {
    this.store.dispatch(pageActions.setGenerator({ generator }));
  }

  public setAboutSubpage(subpage: AboutSubpages): void {
    this.store.dispatch(pageActions.setAboutSubpage({ subpage }));
  }
}
