import { Component, DoCheck, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication-service/authentication.service';
import { UserData, UserService } from './services/user-service/user.service';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CreateBlogEntryComponent } from './components/blog-entry/create-blog-entry/create-blog-entry.component';
import { Subscription } from 'rxjs';
import { Hotel } from './model/hotel.interface';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UpdateUserProfileComponent } from './components/user/update-user-profile/update-user-profile.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {}
}
