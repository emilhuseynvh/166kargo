import { Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { UploadInterceptor } from 'src/shared/interceptors/upload.interceptor';
import { Auth } from 'src/shared/decorators/auth.decorator';

@Controller('file')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Auth()
    @Post('upload')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(UploadInterceptor.getInterceptor())
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.uploadService.create(file);
    }

    @Auth()
    @Delete(':id')
    deleteFile(@Param('id') id: number) {
        return this.uploadService.deleteFile(id);
    }
}
