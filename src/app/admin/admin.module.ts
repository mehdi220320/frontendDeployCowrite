import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { UserlistComponent } from './userlist/userlist.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoomListComponent } from './room-list/room-list.component';
import {FormsModule} from '@angular/forms';
import { BookListComponent } from './book-list/book-list.component';


@NgModule({
    declarations: [
        AdminComponent,
        UserlistComponent,
        DashboardComponent,
        RoomListComponent,
        BookListComponent
    ],
    exports: [
        AdminComponent
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        FormsModule
    ]
})
export class AdminModule { }
