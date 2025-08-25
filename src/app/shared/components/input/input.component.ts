import { ChangeDetectionStrategy, Component, effect, input, linkedSignal, model, output } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatCheckboxChange, MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions, MatTooltipModule } from "@angular/material/tooltip";
import { LetterSet, RegularString } from "@ngen-shared/models";
import { InputType } from "./input-type";

@Component({
   selector: "ngen-input",
   templateUrl: "./input.component.html",
   styleUrl: "./input.component.scss",
   imports: [MatFormFieldModule, MatInputModule, MatCheckboxModule, MatTooltipModule],
   providers: [
      {
         provide: NG_VALUE_ACCESSOR,
         multi: true,
         useExisting: InputComponent
      },
      {
         provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
         useValue: {
            showDelay: 0,
            hideDelay: 0,
            touchendHideDelay: 0,
            disableTooltipInteractivity: true,
            position: "right"
         } satisfies MatTooltipDefaultOptions
      }
   ],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements ControlValueAccessor {
   public readonly label = input("");
   public readonly type = input<InputType>("text");
   public readonly value = model<any>();
   public readonly displayValue = linkedSignal(() => this.transformToDisplayValue(this.value()));
   public readonly disabled = model(false);
   public readonly tooltip = input<string>();
   public readonly disabledTooltip = input<string>();
   public readonly autoModifyWarningMessage = model<string | null>(null);
   public readonly blur = output<void>();
   public readonly autoModify = output<void>();
   public onChange = (value: any) => {};
   public onTouched = () => {};
   public touched = false;
   private displayValueCache: any = null;

   constructor() {
      effect(() => {
         const displayValue = this.displayValue();
         if (this.displayValueCache !== null && displayValue !== this.displayValueCache) {
            this.autoModify.emit();
         }

         this.displayValueCache = null;
      });
   }

   public writeValue(value: any): void {
      this.value.set(value);
      this.autoModifyWarningMessage.set(null);
   }

   public registerOnChange(onChange: typeof this.onChange): void {
      this.onChange = onChange;
   }

   public registerOnTouched(onTouched: typeof this.onTouched): void {
      this.onTouched = onTouched;
   }

   public markAsTouched(): void {
      if (!this.touched) {
         this.onTouched();
         this.touched = true;
      }
   }

   public setDisabledState(disabled: boolean): void {
      this.disabled.set(disabled);
   }

   public onInputBlur(): void {
      this.markAsTouched();
      this.blur.emit();
   }

   public onInputValueChange(event: any): void {
      const enteredValue: string = event.target.value;
      this.displayValueCache = enteredValue;
      const value = this.transformToValue(enteredValue);

      this.displayValue.set(enteredValue);
      setTimeout(() => {
         this.onChange(value);
         this.writeValue(value);
      }, 0);
   }

   public onCheckboxValueChange(event: MatCheckboxChange): void {
      this.onChange(event.checked);
      this.writeValue(event.checked);
   }

   public clearAutoModifyWarningMessage(): void {
      this.autoModifyWarningMessage.set(null);
   }

   private transformToDisplayValue(value: any): any {
      switch (this.type()) {
         case "letter-set":
            return (value as LetterSet).toString();
         case "regular-string":
            return (value as RegularString).toString();
         default:
            return value;
      }
   }

   private transformToValue(value: any): any {
      switch (this.type()) {
         case "number":
            return Number(value);
         case "letter-set":
            return new LetterSet(value);
         case "regular-string":
            return new RegularString(value);
         default:
            return value;
      }
   }
}
