import { NgModule } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { pageFeature } from '@ngen-core/store';
import { AppInitializationUtils } from '@ngen-core/utils/app-initialization.utils';
import { HeaderModule } from '@ngen-header/header.module';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HeaderModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature(pageFeature)
  ],
  providers: [
    MatSnackBar
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    AppInitializationUtils.all();
  }
}
