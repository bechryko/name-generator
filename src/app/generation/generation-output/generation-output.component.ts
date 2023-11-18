import { Component, Input } from '@angular/core';
import { Name } from '@ngen-core/names';

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
  @Input() generatedNames: Name[] = [];

  get displayNames(): DisplayName[] {
    const displayNames: DisplayName[] = [];
    for(const name of this.generatedNames) {
      displayNames.push(this.getDisplayName(name));
    }
    return displayNames;
  }

  private getDisplayName(name: Name): DisplayName {
    if("romaji" in name) {
      return {
        name: name.romaji,
        props: [
          { propName: "Hiragana", propValue: name.hiragana },
          { propName: "Katakana", propValue: name.katakana }
        ]
      };
    }
    if("syllabic" in name) {
      return {
        name: name.name,
        props: [
          { propName: "Syllabized", propValue: name.syllabic.join("-") }
        ]
      };
    }
    if("regularBase" in name) {
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
