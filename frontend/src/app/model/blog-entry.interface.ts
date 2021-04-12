import { Customer } from './customer.interface';
import { Hotel } from './hotel.interface';

export interface BlogEntry {
    id?: number;
    title?: string;
    slug?: string;
    description?: string;
    body?: string;
    createdAt?: Date;
    updatedAt?: Date;
    likes?: number;
    items?: [],
    hotel?: Hotel;
    reserveddate: string;
    reservedcarnumbers: string[];
    reserver?: Customer;
    headerImage?: string;

    publishedDate?: Date;
    isReserved?: boolean;
}

export interface BlogEntriesPageable {
    items: BlogEntry[];
}