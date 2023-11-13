import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderModule } from '@header/header.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HeaderModule
  ],
  providers: [
    MatSnackBar
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
