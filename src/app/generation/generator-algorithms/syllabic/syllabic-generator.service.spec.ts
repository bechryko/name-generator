import { TestBed } from '@angular/core/testing';
import { AppInitializationUtils } from '@ngen-core/utils';
import { GenerationConfig } from '@ngen-generation/models';
import { LetterFinalizerService } from '../letter-finalization/letter-finalizer.service';
import { SyllabicGeneratorService } from "./syllabic-generator.service";

describe('SyllabicGeneratorService', () => {
   let service: SyllabicGeneratorService;
   
   const generatedNameNumber = 500_000;
   const generationConfig: GenerationConfig = {
      minLength: 2,
      maxLength: 4,
      ignoreVoicedUnvoicedPairs: false,
      excludedLetters: "",
      includedLetters: "",
      regularNameStart: "",
      regularNameEnd: "",
      regularNameBase: ""
   };
   
   beforeEach(() => {
      AppInitializationUtils.all();

      TestBed.configureTestingModule({
         providers: [
            SyllabicGeneratorService,
            LetterFinalizerService
         ]
      });
      service = TestBed.inject(SyllabicGeneratorService);
   });
   
   it('should generate syllables with nearly correct length distribution for normal length names', () => {
      const testPrecision = 0.02;

      const lengths = new Array(service["syllableLengthWeights"].length).fill(0);
      for(let i = 0; i < generatedNameNumber; i++) {
         service.generateName(generationConfig).syllabic.forEach(syllable => {
            lengths[syllable.length - 1]++;
         });
      }
      const syllableNumber = lengths.reduce((a, b) => a + b, 0);
      for(let idx = 0; idx < lengths.length; idx++) {
         console.log(`chance of ${ idx + 1 }-long syllables: ${ lengths[idx] / syllableNumber }`);
         const chanceDifference = service["syllableLengthWeights"][idx] - lengths[idx] / syllableNumber;
         expect(chanceDifference)
            .withContext(`distribution of ${ idx + 1 }-long syllables is nearly correct`)
            .toBeLessThan(testPrecision);
      }
   });
});
