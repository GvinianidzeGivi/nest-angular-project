import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, ManyToOne, OneToMany, TreeChildren } from "typeorm";
import { HotelEntity } from "src/hotel/models/hotel.entity";
import { CustomerEntity } from "src/customer/models/customer.entity";
import { Test } from "./test.interface";
import { Customer } from "src/customer/models/customer.interface";
import { Hotel } from "src/hotel/models/hotel.interface";


@Entity('blog_entry')
export class BlogEntryEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    reserveddate: string;

    // @Column()
    // x: boolean;

   


    @Column('text', { array: true, nullable: true })
    hotelinfo: Hotel[];

    // @Column({nullable: true })
    // reservers: Customer;

    // @Column("simple-array")
    // paragraphs: [];

    // @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    // createdAt: Date;

    // @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    // updatedAt: Date;    

  
  
    @ManyToOne(type => CustomerEntity, customer => customer.blogEntries)
    customer: CustomerEntity;




    
    // @OneToMany(type => CustomerEntity, customer => customer.carnumber)
    // customer: HotelEntity;

    // @ManyToOne(type => CustomerEntity, customer => customer.blogEntries)
    // customer: CustomerEntity;

    // @OneToMany(type => CustomerEntity, customer => customer.blogEntries)
    // customer: CustomerEntity;
    // cascade: true;

    // @OneToMany(type => UserEntityx, user => user.blogEntries)
    // reserver: UserEntity;

    // @ManyToOne(type => CustomerEntity, customer => customer.reserveddate)
    // reservers: CustomerEntity;
}