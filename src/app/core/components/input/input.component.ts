import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InputType } from './input-type';

@Component({
  selector: 'ngen-input',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: InputComponent
    }
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  standalone: true
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string = "";
  @Input() type: InputType = 'text';
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
    if(!this.touched) {
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
    if(this.type === 'number') {
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
