import { CanActivate, Injectable, ExecutionContext } from "@nestjs/common";
import { HotelService } from "src/hotel/service/hotel.service";
import { BlogService } from "../service/blog.service";
import { Observable } from "rxjs";
import { Hotel } from "src/hotel/models/hotel.interface";
import { switchMap, map } from "rxjs/operators";
import { BlogEntry } from "../model/blog-entry.interface";
import { Customer } from "src/customer/models/customer.interface";
import { CustomerService } from "src/customer/service/customer.service";

@Injectable()
export class  UserIsAuthorGuard implements CanActivate {

    constructor(private customerService: CustomerService, private blogService: BlogService) {}

    canActivate(context: ExecutionContext): Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const params = request.params;
        const blogEntryId: number = Number(params.id);
        // const hotel: Hotel = request.user;
        const customer: Customer = request.customer;

        return this.customerService.findOne(customer.id).pipe(
            switchMap((customer: Customer) => this.blogService.findOne(blogEntryId).pipe(
                map((blogEntry: BlogEntry) => {
                    let hasPermission = false;
                    if(customer.id === blogEntry.customer.id) {
                        hasPermission = true;
                    }
                    return customer && hasPermission;
                })
            ))
        )       
    }
}