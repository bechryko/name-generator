import {
   ChangeDetectionStrategy,
   Component,
   Input,
   WritableSignal,
   computed,
   effect,
   inject,
   signal
} from "@angular/core";
import { GenerationConfig } from "@ngen-generation/core/models/generation-config";
import { ConfigurationStoreService } from "@ngen-generation/services";
import { InputComponent } from "@ngen-shared/components";
import { InputType } from "@ngen-shared/components/input";
import { LetterSet, RegularString } from "@ngen-shared/models";
import { GeneratorAlgorithmName } from "../core/enums";
import {
   basicDefaultConfig,
   japaneseDefaultConfig,
   regularDefaultConfig,
   syllabicDefaultConfig
} from "./default-configs";
import { BoundedConfigProperty, GeneratorConfigFields, PropertyBounds } from "./model";
import { GenerationConfigUtils } from "./utils";

type FieldName = keyof GenerationConfig;

interface FieldData<FN extends FieldName> {
   value: WritableSignal<GenerationConfig[FN]>;
   disabled: WritableSignal<boolean>;
}

interface ConfigField {
   name: FieldName;
   label: string;
   type: InputType;
   disabledTooltip?: string;
}

@Component({
   selector: "ngen-generation-config",
   templateUrl: "./generation-config.component.html",
   styleUrl: "./generation-config.component.scss",
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [InputComponent]
})
export class GenerationConfigComponent {
   private readonly configStoreService = inject(ConfigurationStoreService);

   public selectedGenerator: GeneratorAlgorithmName = GeneratorAlgorithmName.JAPANESE;
   @Input() set generator(value: GeneratorAlgorithmName) {
      this.selectedGenerator = value;
      this.setConfigValue(this.configStoreService.loadConfig(value));
      for (const field of this.configFields) {
         this.correctFieldValue(field);
      }
   }

   public readonly configFields: ConfigField[] = [
      {
         name: "minLength",
         label: "Minimum length",
         type: "number"
      },
      {
         name: "maxLength",
         label: "Maximum length",
         type: "number"
      },
      {
         name: "excludedLetters",
         label: "Excluded letters",
         type: "letter-set",
         disabledTooltip: "You cannot use the Excluded letters and the Included letters fields simultaneously"
      },
      {
         name: "includedLetters",
         label: "Included letters",
         type: "letter-set",
         disabledTooltip: "You cannot use the Included letters and the Excluded letters fields simultaneously"
      },
      {
         name: "ignoreVoicedUnvoicedPairs",
         label: "Ignore voiced-unvoiced neighbors",
         type: "checkbox"
      },
      {
         name: "regularNameStart",
         label: "Start of the name (regular)",
         type: "regular-string"
      },
      {
         name: "regularNameEnd",
         label: "End of the name (regular)",
         type: "regular-string"
      },
      {
         name: "regularNameBase",
         label: "Regular skeleton of the name",
         type: "regular-string",
         disabledTooltip: "If you specified either a start or an end of a name, you cannot set the whole skeleton"
      },
      {
         name: "syllableAlleviation",
         label: "Syllable alleviation",
         type: "checkbox"
      },
      {
         name: "disableLetterWeights",
         label: "Disable letter weights",
         type: "checkbox"
      }
   ];
   public readonly configFieldsData: Record<FieldName, FieldData<FieldName>>;
   private readonly configObject = computed(() =>
      Object.entries(this.configFieldsData).reduce(
         (previous, [fieldName, fieldData]) => ({
            ...previous,
            [fieldName]: fieldData.value()
         }),
         {} as GenerationConfig
      )
   );

   constructor() {
      this.configFieldsData = this.configFields.reduce(
         (previous, field) => ({
            ...previous,
            [field.name]: {
               value: signal(null),
               disabled: signal(false)
            }
         }),
         {} as any
      );

      effect(() => this.configStoreService.saveConfig(this.selectedGenerator, this.configObject()));
   }

   public onBlur(field: ConfigField): void {
      setTimeout(() => {
         this.correctFieldValue(field);
         this.configStoreService.saveConfig(this.selectedGenerator, this.configObject());
      }, 0);
   }

   public getBounds(property: BoundedConfigProperty): Partial<PropertyBounds> {
      return GenerationConfigUtils.getConfigPropertyBounds(property);
   }

   get generatorConfigFields(): GeneratorConfigFields {
      return GenerationConfigUtils.getConfig(this.selectedGenerator);
   }

   private correctFieldValue(field: ConfigField): void {
      if (!this.configFieldsData[field.name].value()) {
         this.resetField(field.name);
      }

      if (field.name === "minLength") {
         const minBound = this.getBounds(
            this.selectedGenerator === GeneratorAlgorithmName.REGULAR ? "lengthInLetters" : "lengthInSyllables"
         ).min!;
         if ((this.configFieldsData.minLength.value() as number) < minBound) {
            this.setFormFieldValue("minLength", minBound);
         }
         if (this.configFieldsData.minLength.value() > this.configFieldsData.maxLength.value()) {
            this.swapFieldValues("minLength", "maxLength");
            this.correctFieldValue(this.getField("maxLength"));
         }
      }

      if (field.name === "maxLength") {
         const maxBound = this.getBounds(
            this.selectedGenerator === GeneratorAlgorithmName.REGULAR ? "lengthInLetters" : "lengthInSyllables"
         ).max!;
         if ((this.configFieldsData.maxLength.value() as number) > maxBound) {
            this.setFormFieldValue("maxLength", maxBound);
         }
         if (this.configFieldsData.minLength.value() > this.configFieldsData.maxLength.value()) {
            this.swapFieldValues("minLength", "maxLength");
            this.correctFieldValue(this.getField("minLength"));
         }
      }

      if (field.name === "excludedLetters" || field.name === "includedLetters") {
         const otherName = field.name === "excludedLetters" ? "includedLetters" : "excludedLetters";
         const fieldValue = this.configFieldsData[field.name].value() as LetterSet;
         this.configFieldsData[otherName].disabled.set(!fieldValue.isEmpty());
      }

      if (field.name === "regularNameStart" || field.name === "regularNameEnd") {
         this.configFieldsData["regularNameBase"].disabled.set(
            Boolean(
               (this.configFieldsData.regularNameStart.value() as RegularString).length ||
                  (this.configFieldsData.regularNameEnd.value() as RegularString).length
            )
         );
      }

      if (field.name === "regularNameBase") {
         const disabledState = Boolean((this.configFieldsData.regularNameBase.value() as RegularString).length);
         this.configFieldsData.minLength.disabled.set(disabledState);
         this.configFieldsData.maxLength.disabled.set(disabledState);
         this.configFieldsData.regularNameStart.disabled.set(disabledState);
         this.configFieldsData.regularNameEnd.disabled.set(disabledState);
      }
   }

   private setFormFieldValue(fieldName: FieldName, value: GenerationConfig[FieldName]): void {
      this.configFieldsData[fieldName].value.set(value);
   }

   private setConfigValue(newConfig: GenerationConfig): void {
      Object.entries(newConfig).forEach(([fieldName, fieldValue]) => {
         this.configFieldsData[fieldName as FieldName].value.set(fieldValue);
      });
   }

   private swapFieldValues(field1: FieldName, field2: FieldName): void {
      const tmp = this.configFieldsData[field1].value();
      this.setFormFieldValue(field1, this.configFieldsData[field2].value());
      this.setFormFieldValue(field2, tmp);
   }

   private getField(fieldName: FieldName): ConfigField {
      return this.configFields.find(field => field.name === fieldName)!;
   }

   private resetField(fieldName: FieldName): void {
      let selectedConfig;
      switch (this.selectedGenerator) {
         case GeneratorAlgorithmName.JAPANESE:
            selectedConfig = japaneseDefaultConfig;
            break;
         case GeneratorAlgorithmName.REGULAR:
            selectedConfig = regularDefaultConfig;
            break;
         case GeneratorAlgorithmName.SYLLABIC:
            selectedConfig = syllabicDefaultConfig;
            break;
         default:
            selectedConfig = basicDefaultConfig;
      }
      this.setFormFieldValue(fieldName, selectedConfig[fieldName]);
   }
}
