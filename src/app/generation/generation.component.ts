import { Component } from '@angular/core';
import { Generators } from './enums';

@Component({
  selector: 'ngen-generation',
  templateUrl: './generation.component.html',
  styleUrl: './generation.component.scss'
})
export class GenerationComponent {
  public readonly GENERATORS = [];
  public selectedGenerator?: Generators;

  public selectGenerator(generator: Generators): void {
    this.selectedGenerator = generator;
  }
}
