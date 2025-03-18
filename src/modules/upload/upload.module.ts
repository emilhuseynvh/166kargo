import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { UploadEntity } from 'src/entities/upload.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UploadEntity])],
    controllers: [UploadController],
    providers: [UploadService],
})
export class UploadModule { }
