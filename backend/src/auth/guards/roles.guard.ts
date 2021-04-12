import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { HotelService } from "src/hotel/service/hotel.service";
import { Observable } from "rxjs";
import { Hotel } from "src/hotel/models/hotel.interface";
import { map } from "rxjs/operators";
import { hasRoles } from "../decorators/roles.decorator";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,

        @Inject(forwardRef(() => HotelService))
        private hotelService: HotelService
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const hotel: Hotel = request.hotel;

        return this.hotelService.findOne(hotel.id).pipe(
            map((hotel: Hotel) => {
                const hasRole = () => roles.indexOf(hotel.role) > -1;
                let hasPermission: boolean = false;

                if (hasRole()) {
                    hasPermission = true;
                };
                return hotel && hasPermission;
            })
        )
    }
}