import { Injectable, CanActivate, Inject, forwardRef, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { HotelService } from "src/hotel/service/hotel.service";
import { Hotel } from "src/hotel/models/hotel.interface";
import { map } from "rxjs/operators";
import { HotelEntity } from "src/hotel/models/hotel.entity";
import { Customer } from "src/customer/models/customer.interface";
import { CustomerService } from "src/customer/service/customer.service";


@Injectable()
export class UserIsUserGuard implements CanActivate{

    constructor(
        @Inject(forwardRef(() => HotelService))
        private customerService: CustomerService
    ) {

    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const params = request.params;
        const customer: Customer = request.customer;

        return this.customerService.findOne(customer.id).pipe(
            map((customer: Customer) => {
                let hasPermission = false;
                
                if(customer.id === Number(params.id)) {
                    hasPermission = true;
                }

                return customer && hasPermission;                
            })
        )
    }


}