import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntryEntity } from './model/blog-entry.entity';
import { AuthModule } from 'src/auth/auth.module';
import { HotelModule } from 'src/hotel/hotel.module';
import { BlogController } from './controller/blog.controller';
import { BlogService } from './service/blog.service';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([BlogEntryEntity]),
        AuthModule,
        CustomerModule
    ],
    controllers: [BlogController],
    providers: [BlogService]
})
export class BlogModule {}
