import { Controller, Post, Body, Get, Param, Delete, Put, UseGuards, Query, UseInterceptors, UploadedFile, Request, Res } from '@nestjs/common';
import { CustomerService } from '../service/customer.service';
import { Customer, CustomerRole } from '../models/customer.interface';
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
import { CustomerIsCustomerGuard } from 'src/auth/guards/CustomerIsCustomer.guard';

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

@Controller('customers')
export class CustomerController {

    constructor(private customerService: CustomerService) { }

    @Post('/register')
    create(@Body() customer: Customer): Observable<Customer | Object> {
        return this.customerService.create(customer).pipe(
            map((customer: Customer) => customer),
            catchError(err => of({ error: err.message }))
        );
    }

    // @Post('login')
    // login(@Body() customer: Customer): Observable<Object> {
    //     return this.customerService.login(customer).pipe(
    //         map((jwt: string) => {
    //             return { access_token: jwt };
    //         })
    //     )
    // }

    @Get(':id')
    findOne(@Param() params): Observable<Customer> {
        return this.customerService.findOne(params.id);
    }

    @Get()
    findAll(): Observable<Customer[]> {
        return this.customerService.findAll();
    }

    // @Get()
    // index(
    //     @Query('page') page: number = 1,
    //     @Query('limit') limit: number = 10,
    //     @Query('customername') customername: string
    // ): Observable<Pagination<Customer>> {
    //     limit = limit > 100 ? 100 : limit;

    //     if (customername === null || customername === undefined) {
    //         return this.customerService.paginate({ page: Number(page), limit: Number(limit), route: 'http://localhost:3000/api/customers' });
    //     } else {
    //         return this.customerService.paginateFilterByCustomername(
    //             { page: Number(page), limit: Number(limit), route: 'http://localhost:3000/api/customers' },
    //             { customername }
    //         )
    //     }
    // }

    @hasRoles(CustomerRole.ADMIN)
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<any> {
        return this.customerService.deleteOne(Number(id));
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    updateOne(@Param('id') id: string, @Body() customer: Customer): Observable<any> {
        console.log(customer);

        return this.customerService.updateOne(Number(id), customer);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id/role')
    updateRoleOfCustomer(@Param('id') id: string, @Body() customer: Customer): Observable<Customer> {
        return this.customerService.updateRoleOfCustomer(Number(id), customer);
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file, @Request() req): Observable<Object> {
        const customer: Customer = req.customer;

        return this.customerService.updateOne(customer.id, {profileImage: file.filename}).pipe(
            tap((customer: Customer) => console.log(customer)),
            map((customer:Customer) => ({profileImage: customer.profileImage}))
        )
    }

    @Get('profile-image/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imagename)));
    }
}
