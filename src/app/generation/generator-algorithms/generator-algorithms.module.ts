import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LetterFinalizerService } from './letter-finalization/letter-finalizer.service';
import { VoicedUnvoicedPairsUtils } from './letter-finalization/utils';

@NgModule({
  providers: [
    LetterFinalizerService
  ],
  imports: [
    CommonModule
  ]
})
export class GeneratorAlgorithmsModule {
  constructor() {
    VoicedUnvoicedPairsUtils.initPairs();
  }
}
