import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class CreateRatesDto {
    @Type()
    @IsNumber()
    @ApiProperty({ default: 1 })
    minWeight: number;

    @Type()
    @IsNumber()
    @ApiProperty({ default: 2 })
    maxWeight: number;

    @Type()
    @IsNumber()
    @ApiProperty({ default: 2 })
    price: number;

    @Type()
    @IsNumber()
    @ApiProperty({ default: 1 })
    country: number;
}