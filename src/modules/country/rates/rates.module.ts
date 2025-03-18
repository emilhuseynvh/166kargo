import { Module } from "@nestjs/common";
import { RatesService } from "./rates.service";
import { RatesController } from "./rates.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RatesEntity } from "src/entities/rates.entity";
import { CountryEntity } from "src/entities/country.entity";

@Module({
    imports: [TypeOrmModule.forFeature([RatesEntity, CountryEntity])],
    controllers: [RatesController],
    providers: [RatesService]
})
export class RatesModule { }