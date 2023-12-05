import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '@ngen-core/services/auth.service';
import { NgenStoreModule } from '@ngen-core/store';
import { AppInitializationUtils } from '@ngen-core/utils';
import { HeaderModule } from '@ngen-header/header.module';
import { environment } from 'environments/environment';
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
      NgenStoreModule,
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore())
   ],
   providers: [
      MatSnackBar
   ],
   bootstrap: [AppComponent]
})
export class AppModule {
   constructor(
      private readonly authService: AuthService
   ) {
      AppInitializationUtils.all();
      this.authService.onApplicationStart();
   }
}
