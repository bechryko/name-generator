import { Component, Input } from '@angular/core';
import { Name } from '@ngen-core/names';
import { AuthService } from '@ngen-core/services/auth.service';
import { Observable } from 'rxjs';

interface DisplayName {
   name: string;
   props: { propName: string, propValue: string }[];
}

@Component({
   selector: 'ngen-generation-output',
   templateUrl: './generation-output.component.html',
   styleUrl: './generation-output.component.scss'
})
export class GenerationOutputComponent {
   public nameSaved = false;
   private _generatedName: Name | null = null;
   @Input() set generatedName(name: Name | null) {
      this._generatedName = name;
      this.nameSaved = false;
   }
   public readonly isDeveloperLoggedIn$: Observable<boolean>;

   constructor(
      private readonly authService: AuthService
   ) {
      this.isDeveloperLoggedIn$ = this.authService.developerLoggedIn$;
   }

   public get displayName(): DisplayName | null {
      if (!this._generatedName) {
         return null;
      }
      return this.getDisplayName(this._generatedName);
   }

   private getDisplayName(name: Name): DisplayName {
      if ("romaji" in name) {
         return {
            name: name.romaji,
            props: [
               { propName: "Hiragana", propValue: name.hiragana },
               { propName: "Katakana", propValue: name.katakana }
            ]
         };
      }
      if ("syllabic" in name) {
         return {
            name: name.name,
            props: [
               { propName: "Syllabized", propValue: name.syllabic.join("-") }
            ]
         };
      }
      if ("regularBase" in name) {
         return {
            name: name.name,
            props: [
               { propName: "Regular", propValue: name.regularBase.valueOf() }
            ]
         };
      }
      return { name: "", props: [] };
   }
}
