import { Injectable } from '@angular/core';
import { RegularName } from '@ngen-core/names';
import { NameFormatUtils, RandomUtils } from '@ngen-core/utils';
import { GenerationConfig, RegularNameObject } from '@ngen-generation/models';
import { GeneratorAlgorithmsModule } from '../generator-algorithms.module';
import { GeneratorService } from '../generator-service.model';
import { LetterFinalizerService } from '../letter-finalization/letter-finalizer.service';
import { RegularUtils } from '../letter-finalization/utils';
import { matchNameEnding } from '../name-endings';

@Injectable({
  providedIn: GeneratorAlgorithmsModule
})
export class RegularGeneratorService implements GeneratorService {
  constructor(
    private readonly letterFinalizerService: LetterFinalizerService
  ) { }

  public generateName(config: GenerationConfig): RegularName {
    if(!config.regularNameBase) {
      const length = RandomUtils.between(config.minLength, config.maxLength);
      let regularBase = config.regularNameStart;
      for(let i = config.regularNameStart.length; i < length - config.regularNameEnd.length; i++) {
        regularBase += RegularUtils.symbols.wildcard;
      }
      regularBase += config.regularNameEnd;

      regularBase = matchNameEnding(regularBase);

      const name: RegularName = {
        name: "",
        regularBase: new RegularNameObject(regularBase)
      };
      name.name = this.letterFinalizerService.finalizeRegularLetters(name.regularBase.referenceRegular, config);
      name.name = this.dereferenceName(name.name, name.regularBase.references);
      name.name = NameFormatUtils.capitalizeName(name.name);
      return name;
    }

    const regularBase = new RegularNameObject(matchNameEnding(config.regularNameBase));
    let name = this.letterFinalizerService.finalizeRegularLetters(regularBase.valueOf(), config);
    name = this.dereferenceName(name, regularBase.references);
    name = NameFormatUtils.capitalizeName(name);
    return { name, regularBase };
  }

  private dereferenceName(name: string, references: number[]): string {
    let dereferencedName = "";
    for(let i = 0; i < name.length; i++) {
      if(references[i] !== undefined) {
        dereferencedName += dereferencedName[references[i]];
      } else {
        dereferencedName += name[i];
      }
    }
    return dereferencedName;
  }
}
