import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, ManyToMany, ManyToOne, TreeParent, TreeChildren } from "typeorm";
import { BlogEntryEntity } from "src/blog/model/blog-entry.entity";
import { CustomerRole } from "./customer.interface";
import { Hotel } from "src/hotel/models/hotel.interface";
import { HotelEntity } from "src/hotel/models/hotel.entity";



@Entity()
export class CustomerEntity {

    @PrimaryGeneratedColumn()
    id: number;

    // @Column({ unique: true })
    // customername: string;

    @Column({nullable: true})
    firstname: string;

    @Column({nullable: true})
    lastname: string;

    @Column({ unique: true, nullable: true})
    carnumber: string;

    @Column({nullable: true})
    battary: number;

    @Column({nullable: true})
    avarage: number;

    @Column({nullable: true})
    chargingspeed: number;


    @Column({unique: true, nullable: true})
    email: string;

    @Column({select: false, nullable: true})
    password: string;

    @Column({type: 'enum', enum: CustomerRole, default: CustomerRole.CUSTOMER, nullable: true})
    role: CustomerRole;

    @Column({nullable: true})
    profileImage: string;

    // @ManyToOne(type => HotelEntity, hotel => hotel)
  

    @OneToMany(type => BlogEntryEntity, blogEntryEntity => blogEntryEntity.customer)
    blogEntries: BlogEntryEntity[];

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
}