import { ChangeDetectionStrategy, Component, input, linkedSignal, model, output } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatCheckboxChange, MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { LetterSet } from "@ngen-core/models/letter-set";
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
   public readonly disabledTooltip = input<string>();
   public readonly blur = output<void>();
   public onChange = (value: any) => {};
   public onTouched = () => {};
   public touched = false;

   public writeValue(value: any): void {
      this.value.set(value);
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
      const value = this.transformToValue(event.target.value);
      this.onChange(value);
      this.writeValue(value);
   }

   public onCheckboxValueChange(event: MatCheckboxChange): void {
      this.onChange(event.checked);
      this.writeValue(event.checked);
   }

   private transformToDisplayValue(value: any): any {
      switch (this.type()) {
         case "letter-set":
            return (value as LetterSet).toString();
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
         default:
            return value;
      }
   }
}
