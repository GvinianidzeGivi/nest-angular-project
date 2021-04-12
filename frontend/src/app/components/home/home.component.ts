import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { BlogEntriesPageable, BlogEntry } from 'src/app/model/blog-entry.interface';
import { BlogService } from 'src/app/services/blog-service/blog.service';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { UserData, UserService } from 'src/app/services/user-service/user.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { UpdateUserProfileComponent } from '../user/update-user-profile/update-user-profile.component';
import { Hotel } from 'src/app/model/hotel.interface';
import { CreateBlogEntryComponent } from '../blog-entry/create-blog-entry/create-blog-entry.component';
import { ActivatedRoute, Params } from '@angular/router';
import { DatenschutzComponent } from '../datenschutz/datenschutz.component';
import { ReserveComponent } from '../reserve/reserve.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  public isSelectedHotelId:any = new BehaviorSubject([]);
  public selectedHotelColumnIndex:any = new BehaviorSubject([]);

  subscription: Subscription;

  userRole: string;
  isActive: boolean = false;
  userLocationLat;
  userLocationLong;


  options = {
    types : [],
    componentRestrictions: { country: 'MX' }
  }

  title_add;
  latitude;
  longitude;
  zoom;
  addressFormGroup: FormGroup;
  userBattary: number;
  title = 'angular-maps';
  hotels: UserData = null;
  stations: any = null;
  selectedHotelId = 0;
  user = [];
  message;
  today = new Date().toLocaleDateString();
  // blogData: any;
  order: string;
  distance: number;
  math = Math;

  reservedIcon = 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|d82b2b';
  freeIcon = 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|41b309';

  DecodeToken(): any {
    let token = localStorage.getItem('blog-token');
    let userObj =  this.jwtHelper.decodeToken(token);
    if (userObj) {
      return userObj[Object.keys(userObj)[0]].id;
    }
    return
    }



  constructor(
    private userService: UserService, 
    private blogService: BlogService,
    private router: Router, 
    private authService: AuthenticationService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute, 
    private jwtHelper: JwtHelperService) { 
      this.authService.myData.subscribe((data) => {
        this.userRole = data;
       });
    }


  ngOnInit() {  
    this.route.queryParams
      .subscribe(params => {
          let location = params.location.split(',');
          console.log(location[0]);
          console.log(location[1]);
          console.log(params);
          
          this.distance = parseInt(params['distance'])
          this.latitude = parseInt(location[0]);
          this.longitude = parseInt(location[1]);
          
      }
    );  
    // this.userService.currentStationId.subscribe(id => this.message = id)    
    this.userRole = localStorage.getItem('user');
    // this.setCurrentLocation();
    this.getHotels();
    
    }


  getStationsByHotel(id) {
    // console.log(this.DecodeToken()); 
    this.blogService.indexByUser(id).pipe(
      map((stations: any) => this.stations = stations)
    ).subscribe();
  }


  getHotels() {
    this.userService.findAll().pipe(
      map((hotels: UserData) => this.hotels = hotels)
    ).subscribe();
  }

  getStationId(id) {
    this.userService.changeStationId(id)

  }

  getCustomerData(id) {    
    
    this.userService.changeStationId(id)

    this.getStationsByHotel(id);
    if(this.DecodeToken()) {
    this.userService.findOne(this.DecodeToken(), this.userRole).pipe(
      map((user: any) => this.user.push(user))
    ).subscribe();
    }
  }

  toggleNav() {
    this.isActive = !this.isActive;
  }

  // public setCurrentLocation() {    
  //       this.latitude = this.userLocationLat;
  //       this.longitude = this.userLocationLong;
  //     })
  //   }
  // }


  openReserveForm(index) {    
    const dialogRef = this.dialog.open(ReserveComponent);
    this.userService.changeColumnId(index)
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openLogin() {

    const dialogRef = this.dialog.open(LoginComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openRegister() {
    const dialogRef = this.dialog.open(RegisterComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openEdit() {
    const dialogRef = this.dialog.open(UpdateUserProfileComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openAddStation() {
    const dialogRef = this.dialog.open(CreateBlogEntryComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDatenschutz() {
    const dialogRef = this.dialog.open(DatenschutzComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  logout() {
    this.authService.logout();
    this.userBattary = 0;
  }

  isAuth(): boolean {        
    return this.authService.isAuthenticated();
  }

  public handleAddressChange(address: Address) {
    this.latitude = address.geometry.location.lat();
    this.longitude = address.geometry.location.lng();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
}

}
