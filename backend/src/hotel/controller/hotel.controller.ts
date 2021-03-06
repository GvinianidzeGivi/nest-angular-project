import { Controller, Post, Body, Get, Param, Delete, Put, UseGuards, Query, UseInterceptors, UploadedFile, Request, Res } from '@nestjs/common';
import { HotelService } from '../service/hotel.service';
import { Hotel, UserRole } from '../models/hotel.interface';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { UserIsUserGuard } from 'src/auth/guards/UserIsUser.guard';

export const storage = {
    storage: diskStorage({
        destination: './uploads/profileimages',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })

}

@Controller('hotels')
export class HotelController {

    constructor(private hotelService: HotelService) { }

    @Post('/register')
    create(@Body() hotel: Hotel): Observable<Hotel | Object> {
        return this.hotelService.create(hotel).pipe(
            map((hotel: Hotel) => hotel),
            catchError(err => of({ error: err.message }))
        );
    }

    // @Post('login')
    // login(@Body() user: User): Observable<Object> {
    //     return this.userService.login(user).pipe(
    //         map((jwt: string) => {
    //             return { access_token: jwt };
    //         })
    //     )
    // }

    @Get(':id')
    findOne(@Param() params): Observable<Hotel> {
        return this.hotelService.findOne(params.id);
    }

    @Get()
    findAll(): Observable<Hotel[]> {
        return this.hotelService.findAll();
    }


    // @Get()
    // index(
    //     @Query('page') page: number = 1,
    //     @Query('limit') limit: number = 10,
    //     @Query('username') username: string
    // ): Observable<Pagination<User>> {
    //     limit = limit > 100 ? 100 : limit;

    //     if (username === null || username === undefined) {
    //         return this.userService.paginate({ page: Number(page), limit: Number(limit), route: 'http://localhost:3000/api/users' });
    //     } else {
    //         return this.userService.paginateFilterByUsername(
    //             { page: Number(page), limit: Number(limit), route: 'http://localhost:3000/api/users' },
    //             { username }
    //         )
    //     }
    // }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<any> {
        return this.hotelService.deleteOne(Number(id));
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    updateOne(@Param('id') id: string, @Body() hotel: Hotel): Observable<any> {
        return this.hotelService.updateOne(Number(id), hotel);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id/role')
    updateRoleOfUser(@Param('id') id: string, @Body() hotel: Hotel): Observable<Hotel> {
        return this.hotelService.updateRoleOfUser(Number(id), hotel);
    }

    // @UseGuards(JwtAuthGuard)
    // @Post('upload')
    // @UseInterceptors(FileInterceptor('file', storage))
    // uploadFile(@UploadedFile() file, @Request() req): Observable<Object> {
    //     const user: User = req.user;

    //     return this.userService.updateOne(user.id).pipe(
    //         tap((user: User) => console.log(user)),
    //         // map((user:User) => ({profileImage: user.profileImage}))
    //     )
    // }

    @Get('profile-image/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imagename)));
    }
}
