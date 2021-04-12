import { BlogEntry } from "src/blog/model/blog-entry.interface";

export interface Hotel {
    id?: number;
    name?: string;
    lat?: string;
    long?: string;
    column?: string[];
    openhour?: number;
    closehour?: number;
    reservedcarnumbers?: string[];
    reserveddate?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    profileImage?: string;
    // blogEntries?: BlogEntry[];
}

export enum UserRole {
    ADMIN = 'admin',
    HOTEL = 'hotel'
}