import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { switchMap, tap, map, catchError } from 'rxjs/operators';
import { HttpEventType, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { Hotel } from 'src/app/model/hotel.interface';
import { WINDOW } from 'src/app/window-token';
import { Inject } from '@angular/core';
import { Customer } from 'src/app/model/customer.interface';
import { JwtHelperService } from "@auth0/angular-jwt";
import { BlogService } from 'src/app/services/blog-service/blog.service';

export interface File {
  data: any;
  progress: number;
  inProgress: boolean;
}

@Component({
  selector: 'app-update-user-profile',
  templateUrl: './update-user-profile.component.html',
  styleUrls: ['./update-user-profile.component.scss']
})
export class UpdateUserProfileComponent implements OnInit {
  public myData: any = new BehaviorSubject([]);

  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;

  file: File = {
    data: null,
    inProgress: false,
    progress: 0
  };

  reservationId: number;

  userRole: string;
  reserveddate: string;
  reservedCarNumbers: any[] = [];

  reservedHotel: any[] = [];

  reservedHotelName: string;
  reservedHotelColumnIndex: string;

  hotelForm: FormGroup;
  customerForm: FormGroup;


  origin = this.window.location.origin;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private userService: UserService,
    private jwtHelper: JwtHelperService,
    private blogService: BlogService,
    @Inject(WINDOW) private window: Window
  ) {
    // this.authService.myData.subscribe((data) => {
    //   this.userRole = data;
    //  });
     this.userRole = localStorage.getItem('user');

   }

   DecodeToken(): any {
    let token = localStorage.getItem('blog-token');
    let userObj =  this.jwtHelper.decodeToken(token);
    if (userObj) {
      return userObj[Object.keys(userObj)[0]].id;
    }
    return
    }
    


  ngOnInit(): void {    

      this.getReserveByCustomer();
      this.hotelForm = this.formBuilder.group({
        id: [{value: null, disabled: true}, [Validators.required]],
        name: [null, [Validators.required]],
        openhour: [null, [Validators.required]],
        closehour: [null],
        email: [null, [Validators.required]]
      });

      this.authService.getUserId().pipe(
        switchMap((id: number) => this.userService.findOne(id, this.userRole).pipe(
          tap((hotel: Hotel) => {
            this.reserveddate = hotel.reserveddate;
            if (this.userRole === 'hotels') {
            hotel.reservedcarnumbers.map(carnum => this.reservedCarNumbers.push(carnum))
            }
            this.myData.next('users');
            this.hotelForm.patchValue({
              id: hotel.id,
              name: hotel.name,
              openhour: hotel.openhour,
              closehour: hotel.closehour,
              email: hotel.email,
            })
          })
        ))
      ).subscribe()    
     

      this.customerForm = this.formBuilder.group({
        id: [{value: null, disabled: true}, [Validators.required]],
        firstname: [null, [Validators.required]],
        lastname: [null, [Validators.required]],
        carnumber: [null, [Validators.required]],
        battary: [null, [Validators.required]],
        email: [null, [Validators.required]]
      });

      this.authService.getUserId().pipe(
        switchMap((id: number) => this.userService.findOne(id, this.userRole).pipe(          
          tap((customer: Customer) => { 
            this.myData.next('customers');
            this.customerForm.patchValue({
              id: customer.id,
              firstname: customer.firstname,
              lastname: customer.lastname,
              carnumber: customer.carnumber,
              battary: customer.battary,
              email: customer.email,
            })
          })
        ))
      ).subscribe()

        this.getReserveByCustomer()

  }

  onClick() {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.click();
    fileInput.onchange = () => {
      this.file = {
        data: fileInput.files[0],
        inProgress: false,
        progress: 0
      };
      this.fileUpload.nativeElement.value = '';
      // this.uploadFile();
    }
  }

  getReserveByCustomer() {
    this.blogService.indexByUser(this.DecodeToken()).subscribe(reserve => {  
      setTimeout(() => {  
        if(reserve) {
          let reservedHotel =  JSON.parse(reserve[0]['hotelinfo']);
          this.reservationId = reserve[0]['id']        
          this.reservedHotelName = reservedHotel.name
          this.reservedHotelColumnIndex = reservedHotel.hotelcolumnindex
          this.reserveddate = reserve[0]['reserveddate']; 
        }          
           
        // this.reservedHotel = JSON.stringify(reserve[0]['hotelinfo']);
      }, 1000);
    })
  }

  removeReservation() {
    this.blogService.delete(this.reservationId).subscribe()
  }

  // uploadFile() {
  //   const formData = new FormData();
  //   formData.append('file', this.file.data);
  //   this.file.inProgress = true;

  //   this.userService.uploadProfileImage(formData).pipe(
  //     map((event) => {
  //       switch (event.type) {
  //         case HttpEventType.UploadProgress:
  //           this.file.progress = Math.round(event.loaded * 100 / event.total);
  //           break;
  //         case HttpEventType.Response:
  //           return event;
  //       }
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       this.file.inProgress = false;
  //       return of('Upload failed');
  //     })).subscribe((event: any) => {
  //       if(typeof (event) === 'object') {
  //         this.form.patchValue({profileImage: event.body.profileImage});
  //       }
  //     })
  // }

  // getAllUsers() {
  //   this.userService.findAll().subscribe(
      
  //   )
  // }

  updateHotel() {
    this.userService.updateOne(this.DecodeToken(), this.hotelForm.getRawValue(), this.userRole).subscribe();
  }

  updateCustomer() {
    this.userService.updateOne(this.DecodeToken(), this.customerForm.getRawValue(), this.userRole).subscribe();
  }

}
