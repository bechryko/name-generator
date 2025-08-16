import { Injectable } from "@angular/core";
import { AboutSubpage } from "@ngen-about/about-subpage";
import { generatorFlags } from "@ngen-generation/constants";
import { GeneratorAlgorithmName } from "@ngen-generation/core/enums";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
   providedIn: "root"
})
export class PageStateHandlerService {
   private readonly _generator$ = new BehaviorSubject<GeneratorAlgorithmName>(generatorFlags.best);
   private readonly _aboutSubpage$ = new BehaviorSubject<AboutSubpage>(AboutSubpage.INTRODUCTION);

   public setGenerator(generator: GeneratorAlgorithmName): void {
      this._generator$.next(generator);
   }

   public setAboutSubpage(subpage: AboutSubpage): void {
      this._aboutSubpage$.next(subpage);
   }

   public get generator$(): Observable<GeneratorAlgorithmName> {
      return this._generator$.asObservable();
   }

   public get aboutSubpage$(): Observable<AboutSubpage> {
      return this._aboutSubpage$.asObservable();
   }
}
