import { Injectable } from '@nestjs/common';
import { Observable, of, from } from 'rxjs';
import { BlogEntry } from '../model/blog-entry.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntryEntity } from '../model/blog-entry.entity';
import { Repository } from 'typeorm';
import { HotelService } from 'src/hotel/service/hotel.service';
import { Hotel } from 'src/hotel/models/hotel.interface';
import { switchMap, map, tap } from 'rxjs/operators';
import { Pagination, IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Customer } from 'src/customer/models/customer.interface';
import { CustomerService } from 'src/customer/service/customer.service';
const slugify = require('slugify');

@Injectable()
export class BlogService {

    constructor(
        @InjectRepository(BlogEntryEntity) private readonly blogRepository: Repository<BlogEntryEntity>,
        private customerService: CustomerService
    ) {}


    create(customer: Customer, blogEntry: BlogEntry): Observable<BlogEntry> {  
        blogEntry.customer = customer;
        console.log(blogEntry);
        
        // console.log(blogEntry);
        
        // blogEntry.hotel = [{name: "marriot"}]        
        return from(this.blogRepository.save(blogEntry)); 
    }

    findAll(): Observable<BlogEntry[]> {
        return from(this.blogRepository.find({relations: ['customer']}));
    }

    // paginateAll(options: IPaginationOptions): Observable<Pagination<BlogEntry>> {
    //     return from(paginate<BlogEntry>(this.blogRepository, options, {
    //         relations: ['author']
    //     })).pipe(
    //         map((blogEntries: Pagination<BlogEntry>) => blogEntries)
    //     )
    // }

    // paginateByUser(options: IPaginationOptions, userId: number): Observable<Pagination<BlogEntry>> {
    //     return from(paginate<BlogEntry>(this.blogRepository, options, {
    //         relations: ['author'],
    //         where: [
    //             {author: userId}
    //         ]
    //     })).pipe(
    //         map((blogEntries: Pagination<BlogEntry>) => blogEntries)
    //     )
    // }

    findOne(id: number): Observable<BlogEntry> {
        return from(this.blogRepository.findOne({id}, {relations: ['customer']}));
    }

    findByUser(customerId: number): Observable<BlogEntry[]> {
        return from(this.blogRepository.find({
            where: {
                customer: customerId
            },
            relations: ['customer']
        })).pipe(map((blogEntries: BlogEntry[]) => blogEntries))
    }

    updateOne(id: number, blogEntry: BlogEntry): Observable<BlogEntry> {
        return from(this.blogRepository.update(id, blogEntry)).pipe(
            switchMap(() => this.findOne(id))
        )
    }

    // patchOne(id: number, blogEntry: BlogEntry): Observable<BlogEntry> {
    //     return from(this.blogRepository.update(id, blogEntry)).pipe(
    //         switchMap(() => this.findOne(id))
    //     )
    // }

    updateStatus(id: number, isReserved: any): Observable<BlogEntry> {
        return from(this.blogRepository.update(id, isReserved)).pipe(
            switchMap(() => this.findOne(id))
        )
    }

    deleteOne(id: number): Observable<any> {
        return from(this.blogRepository.delete(id));
    }

    generateSlug(title: string): Observable<string> {
        return of(slugify(title));
    }
}
