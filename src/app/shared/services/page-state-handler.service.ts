import { Injectable } from "@angular/core";
import { AboutSubpages } from "@ngen-about/about-subpages";
import { generatorFlags } from "@ngen-generation/constants";
import { Generators } from "@ngen-generation/enums";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
   providedIn: "root"
})
export class PageStateHandlerService {
   private readonly _generator$ = new BehaviorSubject<Generators>(generatorFlags.best);
   private readonly _aboutSubpage$ = new BehaviorSubject<AboutSubpages>(AboutSubpages.INTRODUCTION);

   public setGenerator(generator: Generators): void {
      this._generator$.next(generator);
   }

   public setAboutSubpage(subpage: AboutSubpages): void {
      this._aboutSubpage$.next(subpage);
   }

   public get generator$(): Observable<Generators> {
      return this._generator$.asObservable();
   }

   public get aboutSubpage$(): Observable<AboutSubpages> {
      return this._aboutSubpage$.asObservable();
   }
}
