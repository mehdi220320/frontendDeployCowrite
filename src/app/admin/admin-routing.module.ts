import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {UserlistComponent} from './userlist/userlist.component';
import {RoomListComponent} from './room-list/room-list.component';
import {BookListComponent} from './book-list/book-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UserlistComponent },
  { path: 'rooms', component: RoomListComponent },
  { path: 'books', component: BookListComponent },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
