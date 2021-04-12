import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Customer } from 'src/customer/models/customer.interface';
import { Hotel } from 'src/hotel/models/hotel.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map, catchError} from 'rxjs/operators';
import {paginate, Pagination, IPaginationOptions} from 'nestjs-typeorm-paginate';
import { HotelEntity } from 'src/hotel/models/hotel.entity';
import { CustomerEntity } from 'src/customer/models/customer.entity';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService, 
        @InjectRepository(HotelEntity) private readonly hotelRepository: Repository<HotelEntity>,
        @InjectRepository(CustomerEntity) private readonly customerRepository: Repository<CustomerEntity>,

        ){}

    generateJWT(hotel: Hotel): Observable <string> {
        return from(this.jwtService.signAsync({hotel}));
    }

    generateCustomerJWT(customer: Customer): Observable <string> {
        return from(this.jwtService.signAsync({customer}));
    }

    hashPassword(password: string): Observable <string> {
        return from<string>(bcrypt.hash(password, 12));

    }

    comparePasswords(newPassword: string, passwortHash: string): Observable<any>{
        return from(bcrypt.compare(newPassword, passwortHash));
    }

    loginHotel(hotel: Hotel): Observable<any> {         
        return this.validateHotel(hotel.name, hotel.email, hotel.password).pipe(
            switchMap((hotel: Hotel) => {                
                if(hotel) {
                    return this.generateJWT(hotel).pipe(map((jwt: string) => jwt));
                } else {
                    return 'Wrong Credentials';
                }
            })
        )
    }

    loginCustomer(customer: Customer): Observable<any> {         
        return this.validateCustomer(customer.email, customer.password).pipe(
            switchMap((customer: Customer) => {
                if(customer) {
                    return this.generateCustomerJWT(customer).pipe(map((jwt: string) => jwt));
                } else {
                    return 'Wrong Credentials';
                }
            })
        )
    }

    validateHotel(name: string, email: string, password: string): Observable<Hotel> {
        return from(this.hotelRepository.findOne({email}, {select: ['id', 'name', 'password', 'email']})).pipe(
            switchMap((hotel: Hotel) => this.comparePasswords(password, hotel.password).pipe(
                map((match: boolean) => {
                    if(match) {
                        const {password, ...result} = hotel;
                        return result;
                    } else {
                        throw Error;
                    }
                })
            ))
        )
    }

    validateCustomer(email: string, password: string): Observable<Customer> {
        return from(this.customerRepository.findOne({email}, {select: ['id', 'password', 'email']})).pipe(
            switchMap((customer: Customer) => this.comparePasswords(password, customer.password).pipe(
                map((match: boolean) => {
                    if(match) {
                        const {password, ...result} = customer;
                        return result;
                    } else {
                        throw Error;
                    }
                })
            ))
        )
    }
    

}
