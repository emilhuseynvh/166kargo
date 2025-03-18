import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import config from 'src/config';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { UploadEntity } from 'src/entities/upload.entity';

@Injectable()
export class UploadService {
    constructor(
        @InjectRepository(UploadEntity)
        private uploadRepo: Repository<UploadEntity>,
    ) { }

    async create(file: Express.Multer.File) {
        const newFile = this.uploadRepo.create({
            filename: file.filename,
            path: config.uploadUrl + file.path,
            mimetype: file.mimetype,
        });

        return this.uploadRepo.save(newFile);
    }

    async findOne(id: number) {
        return await this.uploadRepo.findOne({ where: { id } });
    }

    async deleteFile(id: number) {
        let image = await this.uploadRepo.findOne({ where: { id } });

        if (!image) throw new NotFoundException('Image is not found');

        const filePath = join(__dirname, '../../../uploads', image.filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await this.uploadRepo.delete(id);

        return {
            message: "Image deleted succesfully"
        };
    }
}
