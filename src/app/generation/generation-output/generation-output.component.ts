import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { InteractiveIconComponent } from "@ngen-shared/components";
import { Name } from "@ngen-shared/names";

interface DisplayName {
   name: string;
   props: { propName: string; propValue: string }[];
}

@Component({
   selector: "ngen-generation-output",
   templateUrl: "./generation-output.component.html",
   styleUrl: "./generation-output.component.scss",
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [InteractiveIconComponent]
})
export class GenerationOutputComponent {
   public nameSaved = false; // TODO
   private _generatedName: Name | null = null;
   @Input() set generatedName(name: Name | null) {
      this._generatedName = name;
      this.nameSaved = false;
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
            props: [{ propName: "Syllabized", propValue: name.syllabic.join("-") }]
         };
      }
      if ("regularBase" in name) {
         return {
            name: name.name,
            props: [{ propName: "Regular", propValue: name.regularBase.toString() }]
         };
      }
      return { name: "", props: [] };
   }
}
