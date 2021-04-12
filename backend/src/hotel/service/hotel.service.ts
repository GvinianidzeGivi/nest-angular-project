import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HotelEntity } from '../models/hotel.entity';
import { Repository, Like } from 'typeorm';
import { Hotel, UserRole } from '../models/hotel.interface';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map, catchError} from 'rxjs/operators';
import { AuthService } from 'src/auth/services/auth.service';
import {paginate, Pagination, IPaginationOptions} from 'nestjs-typeorm-paginate';

@Injectable()
export class HotelService {

    constructor(
        @InjectRepository(HotelEntity) private readonly hotelRepository: Repository<HotelEntity>,
        private authService: AuthService
    ) {}

    create(hotel: Hotel): Observable<Hotel> {
        return this.authService.hashPassword(hotel.password).pipe(
            switchMap((passwordHash: string) => {
                const newHotel = new HotelEntity();
                newHotel.name = hotel.name;
                newHotel.lat = hotel.lat;
                newHotel.long = hotel.long;
                newHotel.column = hotel.column;
                newHotel.openhour = hotel.openhour;
                newHotel.closehour = hotel.closehour;
                newHotel.email = hotel.email;
                newHotel.password = passwordHash;
                newHotel.profileImage = hotel.profileImage;
                newHotel.role = UserRole.HOTEL;

                return from(this.hotelRepository.save(newHotel)).pipe(
                    map((hotel: Hotel) => {
                        const {password, ...result} = hotel;
                        return result;
                    }),
                    catchError(err => throwError(err))
                )
            })
        )
    }

    findOne(id: number): Observable<Hotel> {
        return from(this.hotelRepository.findOne({id})).pipe(
            map((hotel: Hotel) => {                
                const {password, ...result} = hotel;
                return result;
            } )
        )
    }

    findAll(): Observable<Hotel[]> {
        return from(this.hotelRepository.find()).pipe(
            map((hotels: Hotel[]) => {
                hotels.forEach(function (v) {delete v.password});
                return hotels;
            })
        );
    }

    paginate(options: IPaginationOptions): Observable<Pagination<Hotel>> {
        return from(paginate<Hotel>(this.hotelRepository, options)).pipe(
            map((usersPageable: Pagination<Hotel>) => {
                usersPageable.items.forEach(function (v) {delete v.password});
                return usersPageable;
            })
        )
    }

    // paginateFilterByUsername(options: IPaginationOptions, user: User): Observable<Pagination<User>>{
    //     return from(this.userRepository.findAndCount({
    //         skip: options.page * options.limit || 0,
    //         take: options.limit || 10,
    //         order: {id: "ASC"},
    //         select: ['id', 'name', 'username', 'email', 'role'],
    //         where: [
    //             { username: Like(`%${user.username}%`)}
    //         ]
    //     })).pipe(
    //         map(([users, totalUsers]) => {
    //             const usersPageable: Pagination<User> = {
    //                 items: users,
    //                 links: {
    //                     first: options.route + `?limit=${options.limit}`,
    //                     previous: options.route + ``,
    //                     next: options.route + `?limit=${options.limit}&page=${options.page +1}`,
    //                     last: options.route + `?limit=${options.limit}&page=${Math.ceil(totalUsers / options.limit)}`
    //                 },
    //                 meta: {
    //                     currentPage: options.page,
    //                     itemCount: users.length,
    //                     itemsPerPage: options.limit,
    //                     totalItems: totalUsers,
    //                     totalPages: Math.ceil(totalUsers / options.limit)
    //                 }
    //             };              
    //             return usersPageable;
    //         })
    //     )
    // }

    deleteOne(id: number): Observable<any> {
        return from(this.hotelRepository.delete(id));
    }

    updateOne(id: number, hotel: Hotel): Observable<any> {
        delete hotel.email;
        delete hotel.password;
        delete hotel.role;

        return from(this.hotelRepository.update(id, hotel)).pipe(
            switchMap(() => this.findOne(id))
        );
    }

    updateRoleOfUser(id: number, hotel: Hotel): Observable<any> {
        return from(this.hotelRepository.update(id, hotel));
    }

    //  login(user: User): Observable<string> {
    //     return this.validateUser(user.name, user.email, user.password).pipe(
    //         switchMap((user: User) => {
    //             if(user) {
    //                 return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));
    //             } else {
    //                 return 'Wrong Credentials';
    //             }
    //         })
    //     )
    // }


    // validateUser(name: string, email: string, password: string): Observable<User> {
    //     return from(this.userRepository.findOne({email}, {select: ['id', 'password', 'name', 'lat', 'long', 'email', 'role',]})).pipe(
    //         switchMap((user: User) => this.authService.comparePasswords(password, user.password).pipe(
    //             map((match: boolean) => {
    //                 if(match) {
    //                     const {password, ...result} = user;
    //                     return result;
    //                 } else {
    //                     throw Error;
    //                 }
    //             })
    //         ))
    //     )
    // }

    findByMail(email: string): Observable<Hotel> {
        return from(this.hotelRepository.findOne({email}));
    }
}