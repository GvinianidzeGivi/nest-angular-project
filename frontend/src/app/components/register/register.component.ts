import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, FormArray, FormControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';


class CustomValidators {
  static passwordContainsNumber(control: AbstractControl): ValidationErrors {
    const regex= /\d/;

    

    if(regex.test(control.value) && control.value !== null) {
      return null;
    } else {
      return {passwordInvalid: true};
    }
  }

  static passwordsMatch (control: AbstractControl): ValidationErrors {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;

    if((password === confirmPassword) && (password !== null && confirmPassword !== null)) {
      return null;
    } else {
      return {passwordsNotMatching: true};
    }
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;

  latitude;
  longitude;

  options = {
    types : [],
  }

  registerHotelForm: FormGroup;
  registerCustomerForm: FormGroup;
  activeTab = 'hotels';

  columnForm = new FormGroup({
    column: new FormArray([
       new FormControl('', Validators.required),
    ])
  });

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {


      this.registerHotelForm = this.formBuilder.group({
        name: [null, [Validators.required]],
        lat: [null],
        long: [null],
        column: [],
       chargingspeed: [null],
        openhour: [''],
        closehour: [null],
        reservedcarnumbers: [],
        email: [null, [
          Validators.required,
          Validators.email,
          Validators.minLength(6)
        ]],
        password: [null, [
          Validators.required,
          Validators.minLength(3),
          CustomValidators.passwordContainsNumber
        ]],
        confirmPassword: [null, [Validators.required]]
      },{
         validators: CustomValidators.passwordsMatch
      })


      this.registerCustomerForm = this.formBuilder.group({
        firstname: [null, [Validators.required]],
        lastname: [null, [Validators.required]],
        carnumber: [null, [Validators.required]],
        battary: [null, [Validators.required]],
        chargingspeed: [null, [Validators.required]],
        avarage: [null, [Validators.required]],
        email: [null, [
          Validators.required,
          Validators.email,
          Validators.minLength(6)
        ]],
        password: [null, [
          Validators.required,
          Validators.minLength(3),
          CustomValidators.passwordContainsNumber
        ]],
        confirmPassword: [null, [Validators.required]]
      },{
         validators: CustomValidators.passwordsMatch
      })
  
  } 

  get column(): FormArray {
    return this.columnForm.get('column') as FormArray;
  }

  onFormSubmit(): void {
    for (let i = 0; i < this.column.length; i++) {
    }
  }

  addNameField() {
    this.column.push(new FormControl('', Validators.required));
  }

  deleteNameField(index: number) {
    if (this.column.length !== 1) {
      this.column.removeAt(index);
    }
  }

  public handleAddressChange(address: Address) {
    
    this.latitude = address.geometry.location.lat();
    this.longitude = address.geometry.location.lng();
    
  }

  onHotelSubmit(){
    // let latlong = [this.latitude, this.longitude];
    // this.registerForm['address'] = latlong;

    // this.registerForm.controls['address'] = latlong;
    this.registerHotelForm.value['lat']  = this.latitude;
    this.registerHotelForm.value['long']  = this.longitude;
    this.registerHotelForm.value['column'] = this.columnForm.controls.column.value;    
    // console.log(this.columnForm.controls.column.value);
    
    if(this.registerHotelForm.invalid) {
      return;
    }
    this.authService.register(this.registerHotelForm.value, 'hotels',).pipe(
    ).subscribe()
  }

  onCustomerSubmit(){

    if(this.registerCustomerForm.invalid) {
      return;
    }
    this.authService.register(this.registerCustomerForm.value, 'customers',).pipe(
    ).subscribe()
  }

}
