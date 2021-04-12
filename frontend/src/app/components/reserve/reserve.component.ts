import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { Hotel } from 'src/app/model/hotel.interface';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { BlogService } from 'src/app/services/blog-service/blog.service';
import { UserData, UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ReserveComponent implements OnInit {
  stationId:number;
  columnId:number;
  userRole;
  choosenDate;
  user;
  reserveddates;
  selectedHotel;
  reservedCustomerDates;
  reserverForm = new FormGroup({
    reservedcarnumbers: new FormArray([
       new FormControl('', Validators.required),
    ])
  });

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private blogService: BlogService,
    private hotelService: UserService,
    private jwtHelper: JwtHelperService,
  ) {
    this.authService.myData.subscribe((data) => {
      this.userRole = data;
     });
   }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('user');
    this.userService.currentStationId.subscribe(id => this.stationId = id);
    this.userService.currentColumnId.subscribe(id => this.columnId = id);

    this.userService.findOne(this.DecodeToken(), this.userRole).subscribe(
      user => this.user = user
    )
    this.userService.findAll().pipe(
      map((hotels: UserData) => this.reserveddates = hotels)
    ).subscribe();

    this.userService.findAllCustomers().pipe(
      map((customers: any) => this.reservedCustomerDates = customers)
    ).subscribe();
    this.userService.findOne(this.stationId, 'hotels').pipe(
      map((hotel: Hotel) => this.selectedHotel = hotel)
    ).subscribe();
  }

 
  get reservedcarnumbers(): FormArray {
    return this.reserverForm.get('reservedcarnumbers') as FormArray;
  }
  onFormSubmit(): void {
    for (let i = 0; i < this.reservedcarnumbers.length; i++) {
    }
  }

  addNameField() {
    this.reservedcarnumbers.push(new FormControl('', Validators.required));
  }

  deleteNameField(index: number) {
    if (this.reservedcarnumbers.length !== 1) {
      this.reservedcarnumbers.removeAt(index);
    }
    console.log(this.reservedcarnumbers.length);
  }
 


  myFilter = (d: Date | null): boolean => {
    // return this.reserveddates[0].reserveddate === new Date().toLocaleDateString()
    const day = (d || new Date()).toLocaleDateString();
    return day !== this.reserveddates[0].reserveddate 
           && day !== this.reserveddates[0].reserveddate
  }


  DecodeToken(): any {
    let token = localStorage.getItem('blog-token');
    let userObj =  this.jwtHelper.decodeToken(token);
    if (userObj) {
      return userObj[Object.keys(userObj)[0]].id;
    }
    return
  }

  OnDateChange(p) {    
    let date = new Date().toLocaleDateString();
    this.choosenDate = p.toLocaleDateString();
    this.authService.myData.subscribe((data) => {
      this.userRole = data;
     });     
  }

  updateCustomerReserveDate() {    
     const reservedHotel = [{
       hotelid: this.selectedHotel.id,
       name: this.selectedHotel.name,
       hotelcolumnindex: this.columnId,
      }]
    this.blogService.post(this.choosenDate, reservedHotel).subscribe()
     
  }

  updateHotelReserveDate() {
    let activeUser = localStorage.getItem('user');
    this.hotelService.updateOne(
      this.DecodeToken(),
      [this.choosenDate, this.reserverForm.controls.reservedcarnumbers.value],
      activeUser
      ).pipe(
      // tap(() => this.router.navigate(['/update-profile']))
    ).subscribe()
  }
    // this.userService.updateOne(this.DecodeToken(), this.choosenDate, activeUser).subscribe();
  //   this.blogService.updateByPost(this.stationId, 
  //       {
  //       user: this.user['email'],
  //       reserveddate: this.choosenDate
  //       }
  //     ).subscribe();

  //  }

}
