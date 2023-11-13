import { Component, Input } from '@angular/core';
import { Name } from '@core/names';

@Component({
  selector: 'ngen-generation-output',
  templateUrl: './generation-output.component.html',
  styleUrl: './generation-output.component.scss'
})
export class GenerationOutputComponent {
  @Input() generatedNames: Name[] = [];

  get displayNames(): string[] {
    const displayNames: string[] = [];
    for(const name of this.generatedNames) {
      if(name.romaji) displayNames.push(name.romaji);
    }
    return displayNames;
  }
}
