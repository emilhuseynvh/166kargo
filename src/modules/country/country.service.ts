import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CountryEntity } from "src/entities/country.entity";
import { Repository } from "typeorm";
import { CreateCountryDto } from "./dto/create-country.dto";
import { UpdateCountryDto } from "./dto/update-country.dto";
import { I18nService } from "nestjs-i18n";
import { I18nTranslations } from "src/generated/i18n.generated";

@Injectable()
export class CountryService {
    constructor(
        @InjectRepository(CountryEntity)
        private countryRepo: Repository<CountryEntity>,

        private i18n: I18nService<I18nTranslations>
    ) { }

    async list() {
        let result = await this.countryRepo.find({
            select: {
                id: true,
                name: true,
                currency: true,
                flag: {
                    id: true,
                    path: true
                },
                rates: {
                    id: true,
                    minWeight: true,
                    maxWeight: true,
                    price: true
                }
            },
            relations: ['flag', 'rates']
        });

        return result;
    }

    async create(params: CreateCountryDto) {
        let check = await this.countryRepo.findOne({
            where: { name: params.name }
        });

        if (check) {
            let args = this.i18n.t('arguments.country');
            throw new ConflictException(this.i18n.t('error.conflict', { args: { key: args } }));
        }

        let country = this.countryRepo.create({
            name: params.name,
            currency: params.currency,
            flag: {
                id: params.flag
            }
        });

        await country.save();

        return country;
    }


    async update(id: number, params: UpdateCountryDto) {
        let country = await this.countryRepo.findOne({ where: { id } });

        let args = this.i18n.t('arguments.country');
        if (!country) {
            throw new ConflictException(this.i18n.t('error.notFound', { args: { key: args } }));
        }

        await this.countryRepo.update(id, {
            ...params,
            flag: params.flag ? { id: params.flag } : country.flag
        });

        return {
            message: this.i18n.t('success.updated', { args: { key: args } })
        };
    }

    async deleteCountry(id: number) {
        let result = await this.countryRepo.delete(id);

        let args = this.i18n.t('arguments.country');
        if (!result.affected) {
            throw new ConflictException(this.i18n.t('error.notFound', { args: { key: args } }));
        }


        return {
            message: this.i18n.t('success.deleted', { args: { key: args } })
        };
    }


}