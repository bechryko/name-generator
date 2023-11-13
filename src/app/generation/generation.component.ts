import { Component, inject } from '@angular/core';
import { Name } from '@core/names';
import { JapaneseGeneratorService } from '@generation/generator-algorithms/japanese/japanese-generator.service';
import { Generators } from './enums';
import { GeneratorService } from './generator-algorithms/generator-service.model';
import { GenerationConfig } from './models/generation-config';

@Component({
  selector: 'ngen-generation',
  templateUrl: './generation.component.html',
  styleUrl: './generation.component.scss'
})
export class GenerationComponent {
  private readonly GENERATION_TIMES = 1;
  public readonly GENERATORS: { label: string; value: Generators }[] = [];
  public selectedGenerator: Generators = Generators.JAPANESE;
  public generatedNames: Name[] = [];

  private generatorServices: Record<Generators, GeneratorService> = {
    [Generators.JAPANESE]: inject(JapaneseGeneratorService)
  };

  constructor() {
    for(const generator of Object.values(Generators)) {
      this.GENERATORS.push({ label: generator, value: generator });
    }
  }

  public generateName(config: GenerationConfig): void {
    this.generatedNames = [];
    const service = this.generatorServices[this.selectedGenerator];
    for(let i = 0; i < this.GENERATION_TIMES; i++) {
      this.generatedNames.push(service.generateName(service.completeConfig(config)));
    }
  }

  public selectGenerator(generator: Generators): void {
    this.selectedGenerator = generator;
  }
}
