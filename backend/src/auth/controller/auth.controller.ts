import { Controller, Post, Body, Get, Param, Delete, Put, UseGuards, Query, UseInterceptors, UploadedFile, Request, Res } from '@nestjs/common';
// import { UserService } from '../service/user.service';
// import { User, UserRole } from '../models/user.interface';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { UserIsUserGuard } from 'src/auth/guards/UserIsUser.guard';
import { HotelService } from 'src/hotel/service/hotel.service';
import { Hotel } from 'src/hotel/models/hotel.interface';
import { AuthService } from '../services/auth.service';
import { Customer } from 'src/customer/models/customer.interface';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('login/hotel')
    loginHotel(@Body() hotel: Hotel): Observable<Object> {
        return this.authService.loginHotel(hotel).pipe(
            map((jwt: string) => {
                return { access_token: jwt };
            }) 
        ) 
    }

    @Post('login/customer')
    loginCustomer(@Body() customer: Customer): Observable<Object> {
        return this.authService.loginCustomer(customer).pipe(
            map((jwt: string) => {
                return { access_token: jwt };
            })   
        ) 
    }


}