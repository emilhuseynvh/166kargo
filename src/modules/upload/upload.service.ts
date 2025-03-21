import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import config from 'src/config';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { UploadEntity } from 'src/entities/upload.entity';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

@Injectable()
export class UploadService {
    constructor(
        @InjectRepository(UploadEntity)
        private uploadRepo: Repository<UploadEntity>,

        private i18n: I18nService<I18nTranslations>
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

        let args = this.i18n.t('arguments.image');
        if (!image) throw new NotFoundException(this.i18n.t('error.notFound', { args: { key: args } }));

        const filePath = join(__dirname, '../../../uploads', image.filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await this.uploadRepo.delete(id);

        return {
            message: this.i18n.t('success.deleted', { args: { key: args } })
        };
    }
}
