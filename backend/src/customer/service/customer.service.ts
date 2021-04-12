import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from '../models/customer.entity';
import { Repository, Like } from 'typeorm';
import { Customer, CustomerRole } from '../models/customer.interface';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map, catchError} from 'rxjs/operators';
import { AuthService } from 'src/auth/services/auth.service';
import {paginate, Pagination, IPaginationOptions} from 'nestjs-typeorm-paginate';

@Injectable()
export class CustomerService {

    constructor(
        @InjectRepository(CustomerEntity) private readonly customerRepository: Repository<CustomerEntity>,
        private authService: AuthService
    ) {}

    create(customer: Customer): Observable<Customer> {
        return this.authService.hashPassword(customer.password).pipe(
            switchMap((passwordHash: string) => {
                const newCustomer = new CustomerEntity();
                newCustomer.firstname = customer.firstname;
                newCustomer.lastname = customer.lastname;
                newCustomer.carnumber = customer.carnumber;
                newCustomer.battary = customer.battary;
                newCustomer.avarage = customer.avarage;
                newCustomer.chargingspeed = customer.chargingspeed;
                newCustomer.email = customer.email;
                newCustomer.password = passwordHash;
                newCustomer.role = CustomerRole.CUSTOMER;

                return from(this.customerRepository.save(newCustomer)).pipe(
                    map((customer: Customer) => {
                        const {password, ...result} = customer;
                        return result;
                    }),
                    catchError(err => throwError(err))
                )
            })
        )
    }

    findOne(id: number): Observable<Customer> {
        return from(this.customerRepository.findOne({id}, {relations: ['blogEntries']})).pipe(
            map((customer: Customer) => {
                const {password, ...result} = customer;
                return result;
            } )
        )
    }

    findAll(): Observable<Customer[]> {
        return from(this.customerRepository.find()).pipe(
            map((customers: Customer[]) => {
                customers.forEach(function (v) {delete v.password});
                return customers;
            })
        );
    }

    // paginate(options: IPaginationOptions): Observable<Pagination<Customer>> {
    //     return from(paginate<Customer>(this.customerRepository, options)).pipe(
    //         map((customerPageable: Pagination<Customer>) => {
    //             customerPageable.items.forEach(function (v) {delete v.password});
    //             return customerPageable;
    //         })
    //     )
    // }

    // paginateFilterByCustomername(options: IPaginationOptions, customer: Customer): Observable<Pagination<Customer>>{
    //     return from(this.customerRepository.findAndCount({
    //         skip: options.page * options.limit || 0,
    //         take: options.limit || 10,
    //         order: {id: "ASC"},
    //         select: [
    //             'id', 
    //             'firstname', 
    //             'lastname', 
    //             'carnumber', 
    //             'consumptionavg',
    //             'battarycapacity',
    //             'chargingspeed',
    //             'email', 
    //             'role'],
    //         where: [
    //             { customerrname: Like(`%${customer.firstname}%`)}
    //         ]
    //     })).pipe(
    //         map(([customers, totalCustomers]) => {
    //             const customersPageable: Pagination<Customer> = {
    //                 items: customers,
    //                 // links: {
    //                 //     first: options.route + `?limit=${options.limit}`,
    //                 //     previous: options.route + ``,
    //                 //     next: options.route + `?limit=${options.limit}&page=${options.page +1}`,
    //                 //     last: options.route + `?limit=${options.limit}&page=${Math.ceil(totalCustomers / options.limit)}`
    //                 // },
    //                 // meta: {
    //                 //     currentPage: options.page,
    //                 //     itemCount: customers.length,
    //                 //     itemsPerPage: options.limit,
    //                 //     totalItems: totalCustomers,
    //                 //     totalPages: Math.ceil(totalCustomers / options.limit)
    //                 // }
    //             };              
    //             return customersPageable;
    //         })
    //     )
    // }

    deleteOne(id: number): Observable<any> {
        return from(this.customerRepository.delete(id));
    }

    updateOne(id: number, customer: Customer): Observable<any> {
        console.log(customer);
        
        delete customer.email;
        delete customer.password;
        delete customer.role;

        return from(this.customerRepository.update(id, customer)).pipe(
            switchMap(() => this.findOne(id))
        );
    }

    updateRoleOfCustomer(id: number, customer: Customer): Observable<any> {
        return from(this.customerRepository.update(id, customer));
    }

    // login(customer: Customer): Observable<string> {
    //     return this.validateCustomer(customer.email, customer.password).pipe(
    //         switchMap((customer: Customer) => {
    //             if(customer) {
    //                 return this.authService.generateCustomerJWT(customer).pipe(map((jwt: string) => jwt));
    //             } else {
    //                 return 'Wrong Credentials';
    //             }
    //         })
    //     )
    // }

    // validateCustomer(email: string, password: string): Observable<Customer> {
    //     return from(this.customerRepository.findOne({email}, {select: ['id', 'firstname', 'password', 'email', 'role', 'profileImage']})).pipe(
    //         switchMap((customer: Customer) => this.authService.comparePasswords(password, customer.password).pipe(
    //             map((match: boolean) => {
    //                 if(match) {
    //                     const {password, ...result} = customer;
    //                     return result;
    //                 } else {
    //                     throw Error;
    //                 }
    //             })
    //         ))
    //     )

    // }

    findByMail(email: string): Observable<Customer> {
        return from(this.customerRepository.findOne({email}));
    }
}
