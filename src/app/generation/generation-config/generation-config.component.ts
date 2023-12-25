import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { ErrorService } from '@ngen-core/error-handling';
import { GenerationConfig } from '@ngen-generation/models/generation-config';
import { ConfigurationStoreService } from '@ngen-generation/services';
import isEqual from 'lodash.isequal';
import { Generators } from '../enums';
import { basicDefaultConfig, japaneseDefaultConfig, regularDefaultConfig, syllabicDefaultConfig } from './default-configs';
import { BoundedConfigProperty, GeneratorConfigFields, PropertyBounds } from './model';
import { GenerationConfigUtils, InputFormatUtils } from './utils';

type FieldName = keyof GenerationConfig;

interface ConfigField {
   name: FieldName;
   label: string;
   type: 'number' | 'text' | 'checkbox';
   formatter?: (input: any) => any;
   disabled?: boolean;
}

@Component({
   selector: 'ngen-generation-config',
   templateUrl: './generation-config.component.html',
   styleUrl: './generation-config.component.scss'
})
export class GenerationConfigComponent {
   public selectedGenerator: Generators = Generators.JAPANESE;
   @Input() set generator(value: Generators) {
      this.selectedGenerator = value;
      this.setConfigValue(this.configStoreService.loadConfig(value));
      for (const field of this.configFields) {
         this.correctFieldValue(field);
      }
   }
   @Output() generate: EventEmitter<GenerationConfig> = new EventEmitter<GenerationConfig>();

   public readonly configForm;

   public configFields: ConfigField[] = [
      {
         name: 'minLength',
         label: "Minimum length",
         type: 'number'
      }, {
         name: 'maxLength',
         label: "Maximum length",
         type: 'number'
      }, {
         name: 'excludedLetters',
         label: "Excluded letters",
         type: 'text',
         formatter: InputFormatUtils.formatLetterSetInput.bind(InputFormatUtils)
      }, {
         name: 'includedLetters',
         label: "Included letters",
         type: 'text',
         formatter: InputFormatUtils.formatLetterSetInput.bind(InputFormatUtils)
      }, {
         name: 'ignoreVoicedUnvoicedPairs',
         label: "Ignore voiced-unvoiced neighbors",
         type: 'checkbox'
      }, {
         name: 'regularNameStart',
         label: "Start of the name (regular)",
         type: 'text',
         formatter: InputFormatUtils.formatRegularInput.bind(InputFormatUtils)
      }, {
         name: 'regularNameEnd',
         label: "End of the name (regular)",
         type: 'text',
         formatter: InputFormatUtils.formatRegularInput.bind(InputFormatUtils)
      }, {
         name: 'regularNameBase',
         label: "Regular skeleton of the name",
         type: 'text',
         formatter: InputFormatUtils.formatRegularInput.bind(InputFormatUtils)
      }
   ];

   constructor(
      private readonly fb: NonNullableFormBuilder,
      private readonly errorService: ErrorService,
      private readonly configStoreService: ConfigurationStoreService
   ) {
      const formGroupObject: Record<FieldName, {}> = {} as Record<FieldName, {}>;
      for (const field of this.configFields) {
         formGroupObject[field.name] = [ null ];
      }
      this.configForm = this.fb.group(formGroupObject);
   }

   public onGenerate(): void {
      if (!this.selectedGenerator) return;
      const oldValue = { ...this.configObject };
      for (const field of this.configFields) {
         this.correctFieldValue(field);
      }
      if (isEqual(oldValue, this.configObject)) {
         this.generate.emit(this.configObject);
      } else {
         this.errorService.popupError('generation', 'INVALID_CONFIG_VALUES');
      }
   }

   public onBlur(field: ConfigField): void {
      this.correctFieldValue(field);
      this.configStoreService.saveConfig(this.selectedGenerator, this.configObject);
   }

   public getBounds(property: BoundedConfigProperty): Partial<PropertyBounds> {
      return GenerationConfigUtils.getConfigPropertyBounds(property);
   }

   get configObject(): GenerationConfig {
      return this.configForm.value as GenerationConfig;
   }

   get generatorConfigFields(): GeneratorConfigFields {
      return GenerationConfigUtils.getConfig(this.selectedGenerator);
   }

   private correctFieldValue(field: ConfigField): void {
      if (!this.configObject[field.name]) {
         this.resetField(field.name);
      } else if (field.formatter) {
         this.setFormFieldValue(field.name, field.formatter(this.configObject[field.name]));
      }

      if (field.name === 'minLength') {
         const minBound = this.getBounds(this.selectedGenerator === Generators.REGULAR ? 'lengthInLetters' : 'lengthInSyllables').min!;
         if (this.configObject.minLength < minBound) {
            this.setFormFieldValue('minLength', minBound);
         }
         if (this.configObject.minLength > this.configObject.maxLength) {
            this.swapFieldValues('minLength', 'maxLength');
            this.correctFieldValue(this.getField('maxLength'));
         }
      }

      if (field.name === 'maxLength') {
         const maxBound = this.getBounds(this.selectedGenerator === Generators.REGULAR ? 'lengthInLetters' : 'lengthInSyllables').max!;
         if (this.configObject.maxLength > maxBound) {
            this.setFormFieldValue('maxLength', maxBound);
         }
         if (this.configObject.minLength > this.configObject.maxLength) {
            this.swapFieldValues('minLength', 'maxLength');
            this.correctFieldValue(this.getField('minLength'));
         }
      }

      if (field.name === 'excludedLetters' || field.name === 'includedLetters') {
         const otherName = field.name === 'excludedLetters' ? 'includedLetters' : 'excludedLetters';
         this.getField(otherName).disabled = Boolean(this.configObject[field.name]);
      }

      if (field.name === 'regularNameStart' || field.name === 'regularNameEnd') {
         this.getField('regularNameBase').disabled = Boolean(this.configObject.regularNameStart || this.configObject.regularNameEnd);
      }

      if (field.name === 'regularNameBase') {
         this.getField('minLength').disabled =
            this.getField('maxLength').disabled =
            this.getField('regularNameStart').disabled =
            this.getField('regularNameEnd').disabled = Boolean(this.configObject.regularNameBase);
      }
   }

   private setFormFieldValue(fieldName: FieldName, value: GenerationConfig[FieldName]): void {
      this.configForm.setValue({
         ...this.configObject,
         [fieldName]: value
      }, { emitEvent: false });
   }

   private setConfigValue(newConfig: GenerationConfig): void {
      this.configForm.setValue(newConfig, { emitEvent: false });
   }

   private swapFieldValues(field1: FieldName, field2: FieldName): void {
      const tmp = this.configObject[field1];
      this.setFormFieldValue(field1, this.configObject[field2]);
      this.setFormFieldValue(field2, tmp);
   }

   private getField(fieldName: FieldName): ConfigField {
      return this.configFields.find(field => field.name === fieldName)!;
   }

   private resetField(fieldName: FieldName): void {
      let selectedConfig;
      switch(this.selectedGenerator) {
         case Generators.JAPANESE:
            selectedConfig = japaneseDefaultConfig;
            break;
         case Generators.REGULAR:
            selectedConfig = regularDefaultConfig;
            break;
         case Generators.SYLLABIC:
            selectedConfig = syllabicDefaultConfig;
            break;
         default:
            selectedConfig = basicDefaultConfig;
      }
      this.setFormFieldValue(fieldName, selectedConfig[fieldName]);
   }
}
