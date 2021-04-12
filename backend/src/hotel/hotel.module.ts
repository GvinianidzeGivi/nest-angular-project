import { Module } from '@nestjs/common';
import { HotelService } from './service/hotel.service';
import { HotelController } from './controller/hotel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelEntity } from './models/hotel.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HotelEntity]),
    AuthModule
  ],
  providers: [HotelService],
  controllers: [HotelController],
  exports: [HotelService]
})
export class HotelModule {}
