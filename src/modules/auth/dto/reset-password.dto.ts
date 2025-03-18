import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString } from "class-validator";

export class ResetPasswordDto {
    @Type()
    @IsString()
    @ApiProperty({ default: '123456' })
    currentPassword: string;
    
    @Type()
    @IsString()
    @ApiProperty({ default: '123456' })
    newPassword: string;
    
    @Type()
    @IsString()
    @ApiProperty({ default: '123456' })
    comfirmPassword: string;
}