import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngen-generation-output',
  templateUrl: './generation-output.component.html',
  styleUrl: './generation-output.component.scss'
})
export class GenerationOutputComponent {
  @Input() generatedNames: string[] = [];
}
