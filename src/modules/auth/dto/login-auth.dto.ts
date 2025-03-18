import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

export class LoginAuthDto {
    @Type()
    @IsString()
    @IsEmail()
    @ApiProperty({ default: 'test@example.com' })
    email: string;

    @Type()
    @IsString()
    @ApiProperty({ default: '123456' })
    password: string;
}