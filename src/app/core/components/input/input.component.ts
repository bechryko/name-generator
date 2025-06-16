import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatCheckboxChange, MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
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
   @Input() set ngenDisabled(disabled: boolean) {
      this.disabled = disabled;
   }
   public readonly disabledTooltip = input<string>();
   @Output() blur: EventEmitter<void> = new EventEmitter<void>();
   private _value: any;
   public onChange = (value: any) => {};
   public onTouched = () => {};
   public touched = false;
   public disabled = false;

   public writeValue(value: any): void {
      this._value = value;
   }

   public get value(): any {
      return this._value;
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
      this.disabled = disabled;
   }

   public onInputBlur(): void {
      this.markAsTouched();
      this.blur.emit();
   }

   public onInputValueChange(event: any): void {
      let value = event.target.value;
      if (this.type() === "number") {
         value = Number(value);
      }
      this.onChange(value);
      this.writeValue(value);
   }

   public onCheckboxValueChange(event: MatCheckboxChange): void {
      this.onChange(event.checked);
      this.writeValue(event.checked);
   }
}
