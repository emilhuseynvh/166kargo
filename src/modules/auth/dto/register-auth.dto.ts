import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Gender } from "src/shared/enums/gender.enum";

export class RegisterAuthDto {
    @Type()
    @IsString()
    @IsEmail()
    @ApiProperty({ example: "test@example.com" })
    email: string;

    @Type()
    @IsString()
    @ApiProperty({ example: "123456" })
    password: string;

    @Type()
    @IsString()
    @ApiProperty({ example: "John" })
    name: string;

    @Type()
    @IsString()
    @ApiProperty({ example: "Doe" })
    surname: string;

    @Type()
    @IsString()
    @ApiProperty({ example: "+994501234567" })
    phone: string;

    @Type()
    @IsString()
    @ApiProperty({ example: "ABC1234" })
    fin: string;

    @Type()
    @IsString()
    @ApiProperty({ example: "AA123456" })
    seria: string;

    @Type()
    @IsString()
    @ApiProperty({ example: "1990-01-01" })
    birth: string;

    @Type()
    @IsString()
    @ApiProperty({ example: "Baku, Azerbaijan" })
    address: string;

    @Type()
    @IsString()
    @ApiProperty({ example: "Azerbaijan" })
    nationality: string;

    @Type()
    @IsEnum(Gender, { message: 'gender must be men or women' })
    @ApiProperty({ example: Gender.MEN })
    gender: Gender;

    @Type(() => Number)
    @IsNumber()
    @ApiProperty({ example: 1 })
    precinct: number;
}
