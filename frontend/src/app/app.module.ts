import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatButtonModule, MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { JwtHelperService, JWT_OPTIONS } from "@auth0/angular-jwt";
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar'; 
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { HomeComponent } from './components/home/home.component';
import { MarkdownModule } from 'ngx-markdown';
import { UsersComponent } from './components/user/users/users.component';
import { UpdateUserProfileComponent } from './components/user/update-user-profile/update-user-profile.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { AllBlogEntriesComponent } from './components/blog-entry/all-blog-entries/all-blog-entries.component';
import { CreateBlogEntryComponent } from './components/blog-entry/create-blog-entry/create-blog-entry.component';
import { ViewBlogEntryComponent } from './components/blog-entry/view-blog-entry/view-blog-entry.component';
import { WINDOW_PROVIDERS } from './window-token';
import { GoogleMapsModule } from '@angular/google-maps'
import { FlexLayoutModule } from '@angular/flex-layout';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { AgmCoreModule } from "@agm/core";
import { MatDialogModule } from '@angular/material/dialog';
import { RounderPipe } from './services/rounder.pipe';
import { DatenschutzComponent } from './components/datenschutz/datenschutz.component';
import { ReserveComponent } from './components/reserve/reserve.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MaterialModule } from './material-module';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UsersComponent,
    UpdateUserProfileComponent,
    UserProfileComponent,
    HomeComponent,
    AllBlogEntriesComponent,
    CreateBlogEntryComponent,
    ViewBlogEntryComponent,
    RounderPipe,
    DatenschutzComponent,
    ReserveComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatIconModule,
    MarkdownModule.forRoot(),
    GoogleMapsModule,
    GooglePlaceModule,
    FlexLayoutModule,
    GooglePlaceModule,
    MatDialogModule,
    MatNativeDateModule,
    MaterialModule,
    AgmCoreModule.forRoot({
      apiKey : 'AIzaSyCfDH7smQtFtZL5GYHHdzon-wRjwjXwGMw',
      libraries : ['places']
    }),
    
  ],
  providers: [
    WINDOW_PROVIDERS,
    JwtHelperService, 
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
