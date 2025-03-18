import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CountryEntity } from "src/entities/country.entity";
import { Repository } from "typeorm";
import { CreateCountryDto } from "./dto/create-country.dto";
import { UpdateCountryDto } from "./dto/update-country.dto";

@Injectable()
export class CountryService {
    constructor(
        @InjectRepository(CountryEntity)
        private countryRepo: Repository<CountryEntity>
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

        if (check) throw new ConflictException('Country is already exists');

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

        if (!country) throw new NotFoundException('Country is not found');

        await this.countryRepo.update(id, {
            ...params,
            flag: params.flag ? { id: params.flag } : country.flag
        });

        return {
            message: "Country updated succesfully"
        };
    }

    async deleteCountry(id: number) {
        let result = await this.countryRepo.delete(id);

        if (!result.affected) throw new NotFoundException('Country is not found');

        return {
            message: "Country deleted succesfully"
        };
    }


}