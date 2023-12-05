import { Component } from '@angular/core';
import { Generators } from '@ngen-generation/enums';
import { BoundedConfigProperty, PropertyBounds } from '@ngen-generation/generation-config/model';
import { GenerationConfigUtils } from '@ngen-generation/generation-config/utils';
import { JAPANESE_GENERATOR_VERSION, REGULAR_GENERATOR_VERSION, SYLLABIC_GENERATOR_VERSION } from '@ngen-generation/generator-algorithms';
import { RegularUtils } from '@ngen-generation/generator-algorithms/letter-finalization/utils';

@Component({
   selector: 'ngen-generator-info',
   templateUrl: './generator-info.component.html',
   styleUrl: '../styles/about-content.scss'
})
export class GeneratorInfoComponent {
   public readonly versions: Record<Generators, string> = {
      Japanese: JAPANESE_GENERATOR_VERSION,
      Regular: REGULAR_GENERATOR_VERSION,
      Syllabic: SYLLABIC_GENERATOR_VERSION
   };
   private readonly configPropertyKeys = [
      'lengthInSyllables',
      'lengthInLetters'
   ] as const;
   public readonly configPropertyBounds: Record<BoundedConfigProperty, Partial<PropertyBounds>> = {} as any;
   public readonly regulars = RegularUtils.symbols;

   constructor() {
      this.configPropertyKeys.forEach(key => {
         this.configPropertyBounds[key] = GenerationConfigUtils.getConfigPropertyBounds(key);
      });
   }
}
