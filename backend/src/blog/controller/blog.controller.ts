import { Controller, Post, Body, Request, UseGuards, Get, Query, Param, Delete, Put, UseInterceptors, UploadedFile, Res, Patch } from '@nestjs/common';
import { BlogService } from '../service/blog.service';
import { Observable, of } from 'rxjs';
import { BlogEntry } from '../model/blog-entry.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { BlogEntryEntity } from '../model/blog-entry.entity';
import { UserIsAuthorGuard } from '../guards/user-is-author.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { Image } from '../model/Image.interface';
import { join } from 'path';

export const BLOG_ENTRIES_URL ='http://localhost:3000/api/blog-entries';

export const storage = {
    storage: diskStorage({
        destination: './uploads/blog-entry-images',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })

}

@Controller('blog-entries')
export class BlogController {

    constructor(private blogService: BlogService) {}


    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() blogEntry: BlogEntry, @Request() req): Observable<BlogEntry> {        
        const customer = req.user;        
        return this.blogService.create(customer, blogEntry);
    }

    @Get('user/:id')
    findBlogEntries(@Query('userId') userId: number): Observable<BlogEntry[]> {
        if(userId == null) {
            return this.blogService.findAll();
        } else {
            return this.blogService.findByUser(userId);
        }
    }

    // @Patch('user/:id')
    //     patchOne(@Param('id') id: number, @Body() blogEntry: BlogEntry): Observable<BlogEntry> {
    //         return this.blogService.patchOne(Number(id), blogEntry);
    // }



    // @Get('')
    // index(
    //     @Query('page') page: number = 1,
    //     @Query('limit') limit: number = 10
    // ) {
        

    //     return this.blogService.paginateAll({
    //         route: BLOG_ENTRIES_URL
    //     })
    // }

    // @Get('user/:user')
    // indexByUser(   
    //     @Param('user') userId: number
    // ) {

    //     return this.blogService.findByUser(userId)
    // }

    @Get(':id')
    findOne(@Param('id') id: number): Observable<BlogEntry> {
        return this.blogService.findOne(id);
    }

    @Get()
    findAll(): Observable<BlogEntry[]> {
        return this.blogService.findAll();
    }

    @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
    @Put(':id')
    updateOne(@Param('id') id: number, @Body() blogEntry: BlogEntry): Observable<BlogEntry> {
        return this.blogService.updateOne(Number(id), blogEntry);
    }

    @UseGuards(JwtAuthGuard)
    @Put('status/:id')
    updateStatus(@Param('id') id: number, @Body() isReserved: boolean): Observable<BlogEntry> {
        return this.blogService.updateStatus(Number(id), isReserved);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteOne(@Param('id') id: number): Observable<any> {
        return this.blogService.deleteOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('image/upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file, @Request() req): Observable<Image> {
        return of(file);
    }

    @Get('image/:imagename')
    findImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/blog-entry-images/' + imagename)));
    }
}
