import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RatesEntity } from "src/entities/rates.entity";
import { Repository } from "typeorm";
import { CreateRatesDto } from "./dto/create-rates.dto";
import { CountryEntity } from "src/entities/country.entity";
import { UpdateRatesDto } from "./dto/update-rates.dto";

@Injectable()
export class RatesService {
    constructor(
        @InjectRepository(RatesEntity)
        private ratesRepo: Repository<RatesEntity>,

        @InjectRepository(CountryEntity)
        private countryRepo: Repository<CountryEntity>
    ) { }

    async list(id: number) {
        let result = await this.ratesRepo.findOne({ where: { id } });

        if (!result) throw new NotFoundException('Rates is not found');

        return result;
    }

    async create(params: CreateRatesDto) {
        let checkRates = await this.ratesRepo.findOne({
            where: [
                { minWeight: params.minWeight },
                { maxWeight: params.maxWeight }
            ]
        });

        if (checkRates) throw new ConflictException('Rates is already exists');

        let checkCountry = await this.countryRepo.findOne({
            where: { id: params.country }
        });

        if (!checkCountry) throw new NotFoundException('Country is not found');

        let rates = this.ratesRepo.create({
            minWeight: params.minWeight,
            maxWeight: params.maxWeight,
            price: params.price,
            country: { id: params.country }
        });

        await rates.save();

        return rates;
    }

    async update(id: number, params: UpdateRatesDto) {
        let rates = await this.ratesRepo.findOne({ where: { id } });

        if (!rates) throw new NotFoundException('Rates is not found');

        await this.ratesRepo.update(id, {
            ...params,
            country: params.country ? { id: params.country } : rates.country
        });

        return {
            message: 'Rates updated succesfully'
        };
    }

    async deleteRates(id: number) {
        let result = await this.ratesRepo.delete(id);

        if (!result.affected) throw new NotFoundException('Rates is not found');

        return {
            message: 'Rates is deleted succesfully'
        };
    }

}