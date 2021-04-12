import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginCustomerForm: FormGroup;
  loginHotelForm: FormGroup;

  public customerBattary: any = new BehaviorSubject([]);


  constructor(
    private authService: AuthenticationService,
    private router: Router,
    ) { }

    

  ngOnInit(): void {

    this.loginCustomerForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email, Validators.minLength(6)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(3)])
    })

    this.loginHotelForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email, Validators.minLength(6)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(3)])
    })
  }

  onCustomerSubmit() {
    if(this.loginCustomerForm.invalid) {
      return;
    }
    this.authService.loginCustomer(this.loginCustomerForm.value).subscribe()
  }

  onHotelSubmit() {
    if(this.loginHotelForm.invalid) {
      return;
    }
    this.authService.login(this.loginHotelForm.value).subscribe()
  }

}
