import { Component } from '@angular/core';
import { BoundedConfigProperty, PropertyBounds } from '@ngen-generation/generation-config/model';
import { GenerationConfigUtils } from '@ngen-generation/generation-config/utils';
import { RegularUtils } from '@ngen-generation/generator-algorithms/letter-finalization/utils';

@Component({
   selector: 'ngen-generator-info',
   templateUrl: './generator-info.component.html',
   styleUrl: '../styles/about-content.scss'
})
export class GeneratorInfoComponent {
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
