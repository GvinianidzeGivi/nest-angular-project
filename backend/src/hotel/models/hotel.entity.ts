import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from "typeorm";
import { UserRole } from "./hotel.interface";
import { BlogEntryEntity } from "src/blog/model/blog-entry.entity";
import { CustomerEntity } from "src/customer/models/customer.entity";
import { Customer } from "src/customer/models/customer.interface";



@Entity()
export class HotelEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    name: string;

    @Column({nullable: true})
    lat: string;

    @Column({nullable: true})
    long: string;

    @Column('text', { array: true, nullable: true })
    column: string[];

    @Column({nullable: true})
    openhour: number;

    @Column({nullable: true})
    closehour: number;

    @Column('text', { array: true, nullable: true })
    reservedcarnumbers: string[];

    @Column({nullable: true})
    reserveddate?: string;

    // @Column()
    // openhour: string;

    // @Column()
    // closehour: string;

   

    @Column({unique: true, nullable: true})
    email: string;

    @Column({select: false, nullable: true})
    password: string;

    @Column({type: 'enum', enum: UserRole, default: UserRole.HOTEL, nullable: true})
    role: UserRole;

    @Column({nullable: true})
    profileImage: string;

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
}