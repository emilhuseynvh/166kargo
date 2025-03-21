import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { Lang } from 'src/shared/enums/lang.enum';

export class CreateNewsTranslationsDto {
    @Type()
    @IsString()
    @ApiProperty({ default: 'title' })
    title: string;

    @Type()
    @IsString()
    @ApiProperty({ default: 'Xeber1' })
    description: string;

    @Type()
    @IsEnum(Lang)
    @ApiProperty({ default: Lang.AZ })
    lang: Lang;
}

export class CreateNewsDto {
    @Type()
    @IsNumber()
    @ApiProperty({ default: 1 })
    image: number;

    @Type(() => CreateNewsTranslationsDto)
    @IsArray()
    @ApiProperty({ type: [CreateNewsTranslationsDto] })
    translations: CreateNewsTranslationsDto[];
}
