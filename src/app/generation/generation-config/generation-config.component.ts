import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { ErrorService } from '@ngen-core/error-handling';
import { GenerationConfig } from '@ngen-generation/models/generation-config';
import isEqual from 'lodash.isequal';
import { Generators } from '../enums';
import { GeneratorConfigFields } from './model';
import { GenerationConfigUtils, InputFormatUtils } from './utils';

type FieldName = keyof GenerationConfig;

interface ConfigField {
  name: FieldName;
  label: string;
  type: 'number' | 'text' | 'checkbox';
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

  public readonly configForm;

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
    }, {
      name: 'excludedLetters',
      label: "Excluded letters",
      type: 'text',
      defaultValue: ""
    }, {
      name: 'includedLetters',
      label: "Included letters",
      type: 'text',
      defaultValue: ""
    }, {
      name: 'ignoreVoicedUnvoicedPairs',
      label: "Ignore voiced-unvoiced neighbors",
      type: 'checkbox',
      defaultValue: false
    }, {
      name: 'regularNameStart',
      label: "Start of the name (regular)",
      type: 'text',
      defaultValue: ""
    }, {
      name: 'regularNameEnd',
      label: "End of the name (regular)",
      type: 'text',
      defaultValue: ""
    }, {
      name: 'regularNameBase',
      label: "Regular skeleton of the name",
      type: 'text',
      defaultValue: ""
    }
  ];

  constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly errorService: ErrorService
  ) {
    const formGroupObject: Record<FieldName, {}> = {} as Record<FieldName, {}>;
    for (const field of this.configFields) {
      formGroupObject[field.name] = [field.defaultValue];
    }
    this.configForm = this.fb.group(formGroupObject);
  }

  public correctFieldValue(fieldName: keyof GeneratorConfigFields): void {
    if(this.configObject[fieldName] === undefined) {
      this.configForm.controls[fieldName].reset();
    }
    
    if(fieldName === 'minLength') {
      if(this.configObject.minLength < this.getBounds('length')!.min!) {
        this.setFormFieldValue('minLength', this.getBounds('length')!.min!);
      }
      if(this.configObject.minLength > this.configObject.maxLength) {
        this.swapFieldValues('minLength', 'maxLength');
        this.correctFieldValue('maxLength');
      }
    }

    if(fieldName === 'maxLength') {
      if(this.configObject.maxLength > this.getBounds('length')!.max!) {
        this.setFormFieldValue('maxLength', this.getBounds('length')!.max!);
      }
      if(this.configObject.minLength > this.configObject.maxLength) {
        this.swapFieldValues('minLength', 'maxLength');
        this.correctFieldValue('minLength');
      }
    }

    if(fieldName === 'excludedLetters' || fieldName === 'includedLetters') {
      this.setFormFieldValue(fieldName, InputFormatUtils.formatInput(this.configObject[fieldName]));
      if(this.configObject.excludedLetters) {
        this.configForm.controls.includedLetters.setErrors({ excludedLetters: true }); //TODO: show error on custom input
        this.configForm.controls.includedLetters.markAsTouched();
      } else {
        this.configForm.controls.includedLetters.setErrors(null);
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
      this.errorService.popupError('generation', 'INVALID_CONFIG_VALUES');
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
