import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class CreateCountryDto {
    @Type()
    @IsString()
    @ApiProperty({ default: 'Azerbaijan' })
    name: string;

    @Type()
    @IsNumber()
    @ApiProperty({ default: 2 })
    flag: number;

    @Type()
    @IsString()
    @ApiProperty({ default: 'AZN' })
    currency: string;
}