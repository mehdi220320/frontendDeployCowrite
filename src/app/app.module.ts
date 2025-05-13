import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandpageComponent } from './landpage/landpage.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { EditorComponent } from './editor/editor.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AccueilComponent } from './accueil/accueil.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BookdetailsComponent } from './books/bookdetails/bookdetails.component';
import { DefaultPageComponent } from './default-page/default-page.component';
import { RoomsComponent } from './rooms/rooms.component';
import { BooksComponent } from './books/books.component';
import { RewriterComponent } from './rewriter/rewriter.component';
import { AboutComponent } from './books/bookdetails/about/about.component';
import { WritersComponent } from './books/bookdetails/writers/writers.component';
import { ChaptersComponent } from './books/bookdetails/chapters/chapters.component';
import { CreateRoomComponent } from './rooms/create-room/create-room.component';
import { RoomComponent } from './rooms/room/room.component';
import { ChapterComponent } from './rooms/room/chapter/chapter.component';
import {AdminModule} from "./admin/admin.module";
import {AuthInterceptor} from './services/authentication/auth-interceptor';
import { NameInitialsPipe } from './pipes/name-initials.pipe';
import { CreateBookComponent } from './books/create-book/create-book.component';
import { EtatPipe } from './pipes/etat.pipe';
import { CreateChapterComponent } from './rooms/room/chapter/create-chapter/create-chapter.component';
import { ReadChapterComponent } from './books/bookdetails/chapters/read-chapter/read-chapter.component';
import { SearchComponent } from './search/search.component';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LandpageComponent,
    LoginComponent,
    SignupComponent,
    ContactUsComponent,
    EditorComponent,
    AccueilComponent,
    NavbarComponent,
    BookdetailsComponent,
    DefaultPageComponent,
    RoomsComponent,
    BooksComponent,
    RewriterComponent,
    AboutComponent,
    WritersComponent,
    ChaptersComponent,
    CreateRoomComponent,
    RoomComponent,
    ChapterComponent,
    NameInitialsPipe,
    CreateBookComponent,
    EtatPipe,
    CreateChapterComponent,
    ReadChapterComponent,
    SearchComponent,
    TruncatePipe
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularEditorModule,
        FormsModule,
        HttpClientModule,
        AdminModule
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
