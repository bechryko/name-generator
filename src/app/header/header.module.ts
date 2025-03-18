import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './header.component';

@NgModule({
   declarations: [
      HeaderComponent
   ],
   imports: [
      CommonModule,
      MatButtonModule
   ],
   exports: [
      HeaderComponent
   ]
})
export class HeaderModule { }
