import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TranslationsEntity } from "src/entities/translations.entity";
import { Repository } from "typeorm";

@Injectable()
export class TranslationsService {
    constructor(
        @InjectRepository(TranslationsEntity)
        private translationsRepo: Repository<TranslationsEntity>
    ) { }


}