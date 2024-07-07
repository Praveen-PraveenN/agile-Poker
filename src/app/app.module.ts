import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {environment} from '../environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { RoomComponent } from './shared/room/room.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { CreateRoomComponent } from './shared/create-room/create-room.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatCardModule} from '@angular/material/card';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { UsersChartComponent } from './shared/users-chart/users-chart.component';
import {MatTableModule} from '@angular/material/table';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    RoomComponent,
    CreateRoomComponent,
    UsersChartComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    AngularFireModule.initializeApp(environment.firebase),AngularFireAuthModule,AngularFireDatabaseModule,
    AngularFirestoreModule,
    ClipboardModule,
    MatCardModule,
    CanvasJSAngularChartsModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule
    
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
