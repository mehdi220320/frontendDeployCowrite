import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandpageComponent} from './landpage/landpage.component';
import {EditorComponent} from './editor/editor.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {ContactUsComponent} from './contact-us/contact-us.component';
import {AccueilComponent} from './accueil/accueil.component';
import {RoomsComponent} from './rooms/rooms.component';
import {BooksComponent} from './books/books.component';
import {BookdetailsComponent} from './books/bookdetails/bookdetails.component';
import {RewriterComponent} from './rewriter/rewriter.component';
import {AboutComponent} from './books/bookdetails/about/about.component';
import {WritersComponent} from './books/bookdetails/writers/writers.component';
import {CreateRoomComponent} from './rooms/create-room/create-room.component';
import {RoomComponent} from './rooms/room/room.component';
import {authGuardGuard} from './services/authentication/auth-guard.guard';
import {ChapterComponent} from './rooms/room/chapter/chapter.component';
import {ChaptersComponent} from './books/bookdetails/chapters/chapters.component';
import {CreateChapterComponent} from './rooms/room/chapter/create-chapter/create-chapter.component';
import {ReadChapterComponent} from './books/bookdetails/chapters/read-chapter/read-chapter.component';
import {SearchComponent} from './search/search.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path:'home',component:LandpageComponent},
  {path:'login',component:LoginComponent},
  {path:'signup',component:SignupComponent},
  {path:'editor',component:EditorComponent},
  {path:'contactUs',component:ContactUsComponent},
  {path:'acceuil',component:AccueilComponent,canActivate: [authGuardGuard]},
  {path:'search',component:SearchComponent,canActivate: [authGuardGuard]},
  {path:'rooms',component:RoomsComponent,canActivate: [authGuardGuard]},
  {path:'room/:id',component:RoomComponent,canActivate: [authGuardGuard]},
  {path:'room/:id/chapter/:chapterId',component:ChapterComponent,canActivate: [authGuardGuard]},
  {path:'rooms/create',component:CreateRoomComponent,canActivate: [authGuardGuard]},
  {path:'book',component:BooksComponent,canActivate: [authGuardGuard]},
  {path:'ktiba',component:RewriterComponent,canActivate: [authGuardGuard]},
  {path:'book/:id/chapter/:chapterId',component:ReadChapterComponent,canActivate: [authGuardGuard]},
  {path:'book/:id',component:BookdetailsComponent,canActivate: [authGuardGuard],
    children: [
      { path: '', redirectTo: 'about', pathMatch: 'full' },

      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'writers',
        component: WritersComponent,
      },
      {
        path: 'chapters',
        component: ChaptersComponent,
      }
    ],
  },
  { path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
    ,canActivate: [authGuardGuard],
    data: { role: 'Admin' }
  },
  {path:'room/:id/:bookId/addChapter',component:CreateChapterComponent,canActivate: [authGuardGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
