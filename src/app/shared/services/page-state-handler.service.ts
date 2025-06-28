import { Injectable } from "@angular/core";
import { AboutSubpages } from "@ngen-about/about-subpages";
import { generatorFlags } from "@ngen-generation/constants";
import { GeneratorAlgorithmName } from "@ngen-generation/core/enums";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
   providedIn: "root"
})
export class PageStateHandlerService {
   private readonly _generator$ = new BehaviorSubject<GeneratorAlgorithmName>(generatorFlags.best);
   private readonly _aboutSubpage$ = new BehaviorSubject<AboutSubpages>(AboutSubpages.INTRODUCTION);

   public setGenerator(generator: GeneratorAlgorithmName): void {
      this._generator$.next(generator);
   }

   public setAboutSubpage(subpage: AboutSubpages): void {
      this._aboutSubpage$.next(subpage);
   }

   public get generator$(): Observable<GeneratorAlgorithmName> {
      return this._generator$.asObservable();
   }

   public get aboutSubpage$(): Observable<AboutSubpages> {
      return this._aboutSubpage$.asObservable();
   }
}
