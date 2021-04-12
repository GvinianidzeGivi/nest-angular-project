import { BlogEntry } from "src/blog/model/blog-entry.interface";
import { Hotel } from "src/hotel/models/hotel.interface";

export interface Customer {
    id?: number;
    firstname?: string;
    lastname?: string;
    carnumber?: string;
    battary?: number;
    email?: string;
    password?: string;
    avarage?: number;
    chargingspeed?: number;
    role?: CustomerRole;
    blogentry?: BlogEntry[];
    profileImage?: string;
}

export enum CustomerRole {
    ADMIN = 'admin',
    CUSTOMER = 'customer'
}