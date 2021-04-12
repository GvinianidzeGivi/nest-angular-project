import { Injectable, CanActivate, Inject, forwardRef, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { CustomerService } from "src/customer/service/customer.service";
import { Customer } from "src/customer/models/customer.interface";
import { map } from "rxjs/operators";


@Injectable()
export class CustomerIsCustomerGuard implements CanActivate{

    constructor(
        @Inject(forwardRef(() => CustomerService))
        private customerService: CustomerService
    ) {

    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const params = request.params;
        const customer: Customer = request.hotel;

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