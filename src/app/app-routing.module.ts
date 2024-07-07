import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../app/shared/not-found/not-found.component';
import { AppComponent } from './app.component';
import { RoomComponent } from './shared/room/room.component';
import { CreateRoomComponent } from './shared/create-room/create-room.component';

const routes: Routes = [
  {
    path: '',
    component: CreateRoomComponent
  },
  {
    path: 'room/:uuid',
    component: RoomComponent
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

