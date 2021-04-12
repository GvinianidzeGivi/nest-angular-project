import { Customer } from "src/customer/models/customer.interface";
import { Hotel } from "src/hotel/models/hotel.interface";
import { Test } from "./test.interface";

export interface BlogEntry {
    id?: number;
    customer?: Customer;
    reserveddate: string;
    hotelinfo?: Hotel[];
}