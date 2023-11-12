import { Component, Input } from '@angular/core';
import { Generators } from '../enums';

@Component({
  selector: 'ngen-generation-config',
  templateUrl: './generation-config.component.html',
  styleUrl: './generation-config.component.scss'
})
export class GenerationConfigComponent {
  @Input() selectedGenerator?: Generators;
}
