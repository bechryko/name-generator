import { ChangeDetectionStrategy, Component, Input, WritableSignal, computed, inject, signal } from "@angular/core";
import { InputComponent } from "@ngen-core/components";
import { GenerationConfig } from "@ngen-generation/models/generation-config";
import { ConfigurationStoreService } from "@ngen-generation/services";
import { Generators } from "../enums";
import {
   basicDefaultConfig,
   japaneseDefaultConfig,
   regularDefaultConfig,
   syllabicDefaultConfig
} from "./default-configs";
import { BoundedConfigProperty, GeneratorConfigFields, PropertyBounds } from "./model";
import { GenerationConfigUtils, InputFormatUtils } from "./utils";

type FieldName = keyof GenerationConfig;

interface FieldData<FN extends FieldName> {
   value: WritableSignal<GenerationConfig[FN]>;
   disabled: WritableSignal<boolean>;
}

interface ConfigField {
   name: FieldName;
   label: string;
   type: "number" | "text" | "checkbox";
   formatter?: (input: any) => any;
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

   public selectedGenerator: Generators = Generators.JAPANESE;
   @Input() set generator(value: Generators) {
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
         type: "text",
         formatter: InputFormatUtils.formatLetterSetInput.bind(InputFormatUtils),
         disabledTooltip: "You cannot use the Excluded letters and the Included letters fields simultaneously"
      },
      {
         name: "includedLetters",
         label: "Included letters",
         type: "text",
         formatter: InputFormatUtils.formatLetterSetInput.bind(InputFormatUtils),
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
         type: "text",
         formatter: InputFormatUtils.formatRegularInput.bind(InputFormatUtils)
      },
      {
         name: "regularNameEnd",
         label: "End of the name (regular)",
         type: "text",
         formatter: InputFormatUtils.formatRegularInput.bind(InputFormatUtils)
      },
      {
         name: "regularNameBase",
         label: "Regular skeleton of the name",
         type: "text",
         formatter: InputFormatUtils.formatRegularInput.bind(InputFormatUtils),
         disabledTooltip: "If you specified either a start or an end of a name, you cannot set the whole skeleton"
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
   }

   public onBlur(field: ConfigField): void {
      this.correctFieldValue(field);
      this.configStoreService.saveConfig(this.selectedGenerator, this.configObject());
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
      } else if (field.formatter) {
         this.setFormFieldValue(field.name, field.formatter(this.configFieldsData[field.name].value()));
      }

      if (field.name === "minLength") {
         const minBound = this.getBounds(
            this.selectedGenerator === Generators.REGULAR ? "lengthInLetters" : "lengthInSyllables"
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
            this.selectedGenerator === Generators.REGULAR ? "lengthInLetters" : "lengthInSyllables"
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
         this.configFieldsData[otherName].disabled.set(Boolean(this.configFieldsData[field.name].value()));
      }

      if (field.name === "regularNameStart" || field.name === "regularNameEnd") {
         this.configFieldsData["regularNameBase"].disabled.set(
            Boolean(this.configFieldsData.regularNameStart.value() || this.configFieldsData.regularNameEnd.value())
         );
      }

      if (field.name === "regularNameBase") {
         const disabledState = Boolean(this.configFieldsData.regularNameBase.value());
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
