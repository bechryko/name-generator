import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { GenerationConfig } from '@generation/models/generation-config';
import { Generators } from '../enums';
import { GeneratorConfigFields } from './model';
import { GenerationConfigUtils } from './utils';
import isEqual from 'lodash.isequal';
import { ErrorService } from '@core/error-handling';

type FieldName = keyof GenerationConfig;

interface ConfigField {
  name: FieldName;
  label: string;
  type: 'number';
  defaultValue: {};
}

@Component({
  selector: 'ngen-generation-config',
  templateUrl: './generation-config.component.html',
  styleUrl: './generation-config.component.scss'
})
export class GenerationConfigComponent {
  @Input() selectedGenerator?: Generators;
  @Output() generate: EventEmitter<GenerationConfig> = new EventEmitter<GenerationConfig>();

  public configForm = this.fb.group({
    minLength: [2],
    maxLength: [4]
  });

  public configFields: ConfigField[] = [
    {
      name: 'minLength',
      label: "Minimum length",
      type: 'number',
      defaultValue: 2
    }, {
      name: 'maxLength',
      label: "Maximum length",
      type: 'number',
      defaultValue: 4
    }
  ];

  constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly errorService: ErrorService
  ) { }

  public correctFieldValue(fieldName: keyof GeneratorConfigFields): void {
    if(fieldName === 'minLength') {
      if(!this.configObject.minLength) {
        this.configForm.controls.minLength.reset();
      }
      if(this.configObject.minLength) {
        if(this.configObject.minLength < this.getBounds('length')!.min!) {
          this.setFormFieldValue('minLength', this.getBounds('length')!.min!);
        }
        if(this.configObject.minLength > this.configObject.maxLength) {
          this.swapFieldValues('minLength', 'maxLength');
          this.correctFieldValue('maxLength');
        }
      }
    }

    if(fieldName === 'maxLength') {
      if(!this.configObject.maxLength) {
        this.configForm.controls.maxLength.reset();
      }
      if(this.configObject.maxLength) {
        if(this.configObject.maxLength > this.getBounds('length')!.max!) {
          this.setFormFieldValue('maxLength', this.getBounds('length')!.max!);
        }
        if(this.configObject.minLength > this.configObject.maxLength) {
          this.swapFieldValues('minLength', 'maxLength');
          this.correctFieldValue('minLength');
        }
      }
    }
  }

  public onGenerate(): void {
    if(!this.selectedGenerator) return;
    const oldValue = { ...this.configObject };
    for(const field of this.configFields) {
      this.correctFieldValue(field.name);
    }
    if(isEqual(oldValue, this.configObject)) {
      this.generate.emit(this.configObject);
    } else {
      this.errorService.popupError("Generation", "Name generation failed due to invalid config values!");
    }
  }

  private setFormFieldValue(fieldName: FieldName, value: GenerationConfig[FieldName]): void {
    this.configForm.setValue({
      ...this.configObject,
      [fieldName]: value
    }, { emitEvent: false });
  }

  private swapFieldValues(field1: FieldName, field2: FieldName): void {
    const tmp = this.configObject[field1];
    this.setFormFieldValue(field1, this.configObject[field2]);
    this.setFormFieldValue(field2, tmp);
  }

  public getBounds(property: string) {
    return GenerationConfigUtils.getConfigPropertyBounds(property as any);
  }

  get configObject(): GenerationConfig {
    return this.configForm.value as GenerationConfig;
  }

  get generatorConfigFields(): GeneratorConfigFields {
    return GenerationConfigUtils.getConfig(this.selectedGenerator);
  }
}
