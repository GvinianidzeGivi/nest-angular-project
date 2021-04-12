import { Module, forwardRef } from '@nestjs/common';
import { JwtModule} from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-guard';
import { JwtStrategy } from './guards/jwt-strategy';
import { HotelModule } from 'src/hotel/hotel.module';
import { AuthController } from './controller/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelEntity } from 'src/hotel/models/hotel.entity';
import { CustomerEntity } from 'src/customer/models/customer.entity';

@Module({
    imports: [   
        TypeOrmModule.forFeature([HotelEntity, CustomerEntity]),
        forwardRef(() => HotelModule),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {expiresIn: '10000s'}
            })
        })
    ],
    providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy ],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule { }
